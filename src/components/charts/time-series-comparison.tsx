'use client';

import { useMemo, useRef, useEffect, useState, useCallback, type KeyboardEvent } from 'react';
import { useLocale } from 'next-intl';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import { AccessibleDataTable } from '@/components/charts/accessible-data-table';

export interface TimeSeriesDataPoint {
  year: number;
  israel: number;
  oecdAverage: number;
}

interface TimeSeriesComparisonProps {
  data: TimeSeriesDataPoint[];
  unit: string;
  israelLabel?: string;
  oecdLabel?: string;
}

const MARGIN = { top: 16, right: 12, bottom: 32, left: 46 };
const ISRAEL_COLOR = '#ef4444';
const OECD_COLOR = '#94a3b8';

export function TimeSeriesComparison({
  data,
  unit,
  israelLabel,
  oecdLabel,
}: TimeSeriesComparisonProps) {
  const locale = useLocale();
  const isRTL = locale === 'he';
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(500);
  const height = 260;
  const [hovered, setHovered] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const dir = (e.key === 'ArrowRight') !== isRTL ? 1 : -1;
        setFocusedIdx((prev) => {
          const next = (prev ?? -1) + dir;
          return Math.max(0, Math.min(data.length - 1, next));
        });
      } else if (e.key === 'Escape') {
        setFocusedIdx(null);
      }
    },
    [data.length, isRTL],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const innerW = width - MARGIN.left - MARGIN.right;
  const innerH = height - MARGIN.top - MARGIN.bottom;

  const { xScale, yScale, israelPath, oecdPath, xTicks, yTicks } = useMemo(() => {
    const xDomain = d3Array.extent(data, (d) => d.year) as [number, number];
    const xS = d3Scale
      .scaleLinear()
      .domain(xDomain)
      .range(isRTL ? [innerW, 0] : [0, innerW]);

    const yMax =
      d3Array.max(data, (d) => Math.max(d.israel, d.oecdAverage)) ?? 50;
    const yS = d3Scale
      .scaleLinear()
      .domain([0, yMax * 1.15])
      .range([innerH, 0])
      .nice();

    const makeLine = (accessor: (d: TimeSeriesDataPoint) => number) =>
      d3Shape
        .line<TimeSeriesDataPoint>()
        .x((d) => xS(d.year))
        .y((d) => yS(accessor(d)))
        .curve(d3Shape.curveMonotoneX);

    return {
      xScale: xS,
      yScale: yS,
      israelPath: makeLine((d) => d.israel)(data) ?? '',
      oecdPath: makeLine((d) => d.oecdAverage)(data) ?? '',
      xTicks: xS.ticks(Math.min(data.length, 8)),
      yTicks: yS.ticks(5),
    };
  }, [data, innerW, innerH, isRTL]);

  // Find nearest data point for hover or keyboard focus
  const hoveredPoint = useMemo(() => {
    if (focusedIdx !== null) return data[focusedIdx] ?? null;
    if (hovered === null) return null;
    const x = hovered - MARGIN.left;
    const year = Math.round(xScale.invert(x));
    return data.find((d) => d.year === year) ?? null;
  }, [hovered, focusedIdx, xScale, data]);

  const il = israelLabel ?? (isRTL ? 'ישראל' : 'Israel');
  const oecd = oecdLabel ?? (isRTL ? 'ממוצע OECD' : 'OECD Average');

  const tableRows = useMemo(
    () =>
      data.map((d) => ({
        year: String(d.year),
        israel: `${d.israel}${unit}`,
        oecdAverage: `${d.oecdAverage}${unit}`,
      })),
    [data, unit],
  );

  return (
    <div ref={containerRef} className="w-full">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="img"
        aria-label={`${il} vs ${oecd} — ${data[0]?.year ?? ''}–${data[data.length - 1]?.year ?? ''}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onBlur={() => setFocusedIdx(null)}
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          if (x >= MARGIN.left && x <= width - MARGIN.right) {
            setFocusedIdx(null);
            setHovered(x);
          } else {
            setHovered(null);
          }
        }}
        onPointerLeave={() => setHovered(null)}
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Grid lines */}
          {yTicks.map((tick) => (
            <line
              key={tick}
              x1={0}
              x2={innerW}
              y1={yScale(tick)}
              y2={yScale(tick)}
              className="stroke-muted-foreground/15"
              strokeDasharray="3 3"
            />
          ))}

          {/* OECD line (behind) */}
          <path
            d={oecdPath}
            fill="none"
            stroke={OECD_COLOR}
            strokeWidth={2}
            strokeDasharray="6 3"
          />

          {/* Israel line (front) */}
          <path
            d={israelPath}
            fill="none"
            stroke={ISRAEL_COLOR}
            strokeWidth={2.5}
          />

          {/* Data point dots */}
          {data.map((d) => (
            <g key={d.year}>
              <circle
                cx={xScale(d.year)}
                cy={yScale(d.israel)}
                r={3}
                fill={ISRAEL_COLOR}
              />
              <circle
                cx={xScale(d.year)}
                cy={yScale(d.oecdAverage)}
                r={3}
                fill={OECD_COLOR}
              />
            </g>
          ))}

          {/* X axis labels */}
          {xTicks.map((tick) => (
            <text
              key={tick}
              x={xScale(tick)}
              y={innerH + 20}
              textAnchor="middle"
              className="fill-muted-foreground text-[11px]"
            >
              {tick}
            </text>
          ))}

          {/* Y axis labels */}
          {yTicks.map((tick) => (
            <text
              key={tick}
              x={isRTL ? innerW + 8 : -8}
              y={yScale(tick)}
              textAnchor={isRTL ? 'start' : 'end'}
              dominantBaseline="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {tick}
              {unit}
            </text>
          ))}

          {/* Hover crosshair + tooltip */}
          {hoveredPoint && (
            <>
              <line
                x1={xScale(hoveredPoint.year)}
                x2={xScale(hoveredPoint.year)}
                y1={0}
                y2={innerH}
                className="stroke-muted-foreground/30"
                strokeDasharray="2 2"
              />
              <circle
                cx={xScale(hoveredPoint.year)}
                cy={yScale(hoveredPoint.israel)}
                r={5}
                fill={ISRAEL_COLOR}
                stroke="white"
                strokeWidth={2}
              />
              <circle
                cx={xScale(hoveredPoint.year)}
                cy={yScale(hoveredPoint.oecdAverage)}
                r={5}
                fill={OECD_COLOR}
                stroke="white"
                strokeWidth={2}
              />
            </>
          )}
        </g>
      </svg>

      {/* Hover/focus tooltip (HTML overlay for proper RTL) */}
      {hoveredPoint && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none -mt-2 mb-1 flex justify-center text-xs gap-4"
        >
          <span className="font-medium" style={{ color: ISRAEL_COLOR }}>
            {il}: {hoveredPoint.israel}{unit}
          </span>
          <span style={{ color: OECD_COLOR }}>
            {oecd}: {hoveredPoint.oecdAverage}{unit}
          </span>
          <span className="text-muted-foreground">({hoveredPoint.year})</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded"
            style={{ backgroundColor: ISRAEL_COLOR }}
          />
          {il}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-0.5 w-4 rounded border-t border-dashed"
            style={{ borderColor: OECD_COLOR }}
          />
          {oecd}
        </span>
      </div>

      <AccessibleDataTable
        caption={`${il} vs ${oecd}`}
        columns={[
          { key: 'year', label: isRTL ? 'שנה' : 'Year' },
          { key: 'israel', label: il },
          { key: 'oecdAverage', label: oecd },
        ]}
        rows={tableRows}
      />
    </div>
  );
}
