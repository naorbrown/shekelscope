'use client';

import { useMemo, useRef, useEffect, useState, useCallback, type KeyboardEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { hierarchy, treemap, treemapSquarify } from 'd3-hierarchy';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { AccessibleDataTable } from '@/components/charts/accessible-data-table';

interface TreemapDatum {
  id: string;
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

interface RootDatum {
  children: TreemapDatum[];
}

export function BudgetTreemap() {
  const t = useTranslations('dashboard');
  const bt = useTranslations('budget');
  const locale = useLocale();
  const isHe = locale === 'he';
  const { result } = useCalculatorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lockedId, setLockedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const divisor = 12;
  const height = Math.max(300, width * 0.55);

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

  const leaves = useMemo(() => {
    if (!result) return [];

    const children: TreemapDatum[] = result.budgetAllocation.map((item) => ({
      id: item.id,
      name: bt(item.id),
      amount: Math.round(item.amount / divisor),
      color: item.color,
      percentage: item.percentage,
    }));

    const root = hierarchy<RootDatum>({ children })
      .sum((d) => ('amount' in d ? (d as unknown as TreemapDatum).amount : 0))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    treemap<RootDatum>()
      .size([width, height])
      .padding(2)
      .tile(treemapSquarify.ratio(1.2))(root);

    return root.leaves() as Array<
      ReturnType<typeof hierarchy<RootDatum>> & {
        data: TreemapDatum;
        x0: number;
        x1: number;
        y0: number;
        y1: number;
      }
    >;
  }, [result, divisor, width, height, bt]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent, id: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setLockedId((prev) => (prev === id ? null : id));
      } else if (e.key === 'Escape') {
        setLockedId(null);
        setActiveId(null);
      }
    },
    [],
  );

  const visibleId = lockedId ?? activeId;

  const tableRows = useMemo(
    () =>
      leaves.map((leaf) => ({
        name: leaf.data.name,
        amount: formatCurrency(leaf.data.amount),
        percentage: `${leaf.data.percentage}%`,
      })),
    [leaves],
  );

  if (!result) return null;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('treemapTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={containerRef} className="relative w-full">
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={t('treemapTitle')}
            >
              {leaves.map((leaf) => {
                const d = leaf.data;
                const w = leaf.x1 - leaf.x0;
                const h = leaf.y1 - leaf.y0;
                const isActive = visibleId === d.id;
                const showLabel = w > 55 && h > 35;
                const showAmount = w > 70 && h > 50;

                return (
                  <g
                    key={d.id}
                    onPointerEnter={() => { if (!lockedId) setActiveId(d.id); }}
                    onPointerLeave={() => { if (!lockedId) setActiveId(null); }}
                    className="cursor-pointer"
                    role="button"
                    aria-label={`${d.name}: ${formatCurrency(d.amount)} (${d.percentage}%)`}
                    aria-pressed={lockedId === d.id}
                    tabIndex={0}
                    onFocus={() => { if (!lockedId) setActiveId(d.id); }}
                    onBlur={() => { if (!lockedId) setActiveId(null); }}
                    onKeyDown={(e) => handleKeyDown(e, d.id)}
                  >
                    <rect
                      x={leaf.x0}
                      y={leaf.y0}
                      width={w}
                      height={h}
                      rx={4}
                      fill={d.color}
                      opacity={isActive ? 1 : 0.85}
                      stroke={isActive ? 'white' : 'transparent'}
                      strokeWidth={isActive ? 2 : 0}
                      className="transition-opacity"
                    />
                    {showLabel && (
                      <text
                        x={leaf.x0 + w / 2}
                        y={leaf.y0 + h / 2 - (showAmount ? 7 : 0)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize={w > 90 ? 12 : 10}
                        fontWeight={600}
                        direction={isHe ? 'rtl' : 'ltr'}
                        className="pointer-events-none select-none"
                      >
                        {d.name.length > Math.floor(w / 8)
                          ? d.name.slice(0, Math.floor(w / 8)) + '…'
                          : d.name}
                      </text>
                    )}
                    {showAmount && (
                      <text
                        x={leaf.x0 + w / 2}
                        y={leaf.y0 + h / 2 + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.75)"
                        fontSize={10}
                        className="pointer-events-none select-none"
                      >
                        {formatCurrency(d.amount)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {visibleId && (() => {
              const leaf = leaves.find((l) => l.data.id === visibleId);
              if (!leaf) return null;
              const d = leaf.data;
              const tooltipX = leaf.x0 + (leaf.x1 - leaf.x0) / 2;
              const tooltipY = leaf.y0;

              return (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute z-10 pointer-events-none rounded-md border bg-card px-3 py-2 text-xs shadow-lg"
                  style={{
                    left: Math.min(tooltipX, width - 120),
                    top: Math.max(0, tooltipY - 50),
                    transform: 'translateX(-50%)',
                  }}
                >
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-muted-foreground">
                    {formatCurrency(d.amount)} ({d.percentage}%)
                  </p>
                </div>
              );
            })()}

            <AccessibleDataTable
              caption={t('treemapTitle')}
              columns={[
                { key: 'name', label: isHe ? 'קטגוריה' : 'Category' },
                { key: 'amount', label: isHe ? 'סכום' : 'Amount' },
                { key: 'percentage', label: '%' },
              ]}
              rows={tableRows}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
