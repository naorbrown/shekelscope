'use client';

import { useMemo, useRef, useEffect, useState, useCallback, type PointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  sankeyJustify,
  type SankeyNode,
  type SankeyLink,
} from 'd3-sankey';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/components/shared/currency-display';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { AccessibleDataTable } from '@/components/charts/accessible-data-table';

interface NodeExtra { name: string; color: string }
interface LinkExtra { source: number; target: number; value: number }
type SNode = SankeyNode<NodeExtra, LinkExtra>;
type SLink = SankeyLink<NodeExtra, LinkExtra>;

const PADDING = { top: 8, right: 16, bottom: 8, left: 16 };

export function SankeyFlow() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const isRTL = locale === 'he';
  const { result } = useCalculatorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(700);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [focusedLink, setFocusedLink] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    from: string;
    to: string;
    value: number;
  } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const height = Math.max(350, width * 0.5);

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

  const graph = useMemo(() => {
    if (!result) return null;

    const itx = Math.max(0, result.incomeTax.netTax);
    const ni = result.nationalInsurance.employeeContribution;
    const ht = result.healthTax.contribution;
    const total = itx + ni + ht;
    if (total <= 0) return null;

    // Column 1: Income source
    const nodes: NodeExtra[] = [
      { name: isRTL ? 'הכנסה' : 'Income', color: '#4A8B6F' },
    ];

    // Column 2: Tax types
    const taxStartIdx = nodes.length;
    if (itx > 0) nodes.push({ name: isRTL ? 'מס הכנסה' : 'Income Tax', color: '#B05A50' });
    if (ni > 0) nodes.push({ name: isRTL ? 'ביטוח לאומי' : "Nat'l Insurance", color: '#B08850' });
    if (ht > 0) nodes.push({ name: isRTL ? 'מס בריאות' : 'Health Tax', color: '#2D7A8A' });

    // Column 3: Budget categories
    const budgetStartIdx = nodes.length;
    for (const alloc of result.budgetAllocation) {
      nodes.push({
        name: isRTL ? alloc.nameHe : alloc.nameEn,
        color: alloc.color,
      });
    }

    // Links: income → tax types
    const links: LinkExtra[] = [];
    let taxIdx = taxStartIdx;
    if (itx > 0) links.push({ source: 0, target: taxIdx++, value: itx });
    if (ni > 0) links.push({ source: 0, target: taxIdx++, value: ni });
    if (ht > 0) links.push({ source: 0, target: taxIdx++, value: ht });

    // Links: tax types → budget categories
    const taxAmounts: { idx: number; amount: number }[] = [];
    taxIdx = taxStartIdx;
    if (itx > 0) taxAmounts.push({ idx: taxIdx++, amount: itx });
    if (ni > 0) taxAmounts.push({ idx: taxIdx++, amount: ni });
    if (ht > 0) taxAmounts.push({ idx: taxIdx++, amount: ht });

    for (const tax of taxAmounts) {
      for (let i = 0; i < result.budgetAllocation.length; i++) {
        const pct = result.budgetAllocation[i].percentage / 100;
        const value = tax.amount * pct;
        if (value > 1) {
          links.push({ source: tax.idx, target: budgetStartIdx + i, value });
        }
      }
    }

    if (links.length === 0) return null;

    const innerW = width - PADDING.left - PADDING.right;
    const innerH = height - PADDING.top - PADDING.bottom;

    const generator = d3Sankey<NodeExtra, LinkExtra>()
      .nodeWidth(14)
      .nodePadding(4)
      .nodeAlign(sankeyJustify)
      .extent([
        [PADDING.left, PADDING.top],
        [PADDING.left + innerW, PADDING.top + innerH],
      ]);

    return generator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });
  }, [result, width, height, isRTL]);

  const activeLink = hoveredLink ?? focusedLink;

  const handleLinkKeyDown = useCallback(
    (e: ReactKeyboardEvent, i: number, link: SLink) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const src = link.source as SNode;
        const tgt = link.target as SNode;
        setFocusedLink((prev) => (prev === i ? null : i));
        setTooltip({
          x: ((src.x1 ?? 0) + (tgt.x0 ?? 0)) / 2,
          y: ((src.y0 ?? 0) + (src.y1 ?? 0)) / 2,
          from: src.name,
          to: tgt.name,
          value: link.value,
        });
      } else if (e.key === 'Escape') {
        setFocusedLink(null);
        setTooltip(null);
      }
    },
    [],
  );

  const flowTableRows = useMemo(() => {
    if (!graph) return [];
    return graph.links.map((link) => {
      const src = link.source as SNode;
      const tgt = link.target as SNode;
      return {
        from: src.name,
        to: tgt.name,
        amount: formatCurrency(link.value),
      };
    });
  }, [graph]);

  if (!result || !graph) return null;

  const linkPath = sankeyLinkHorizontal();

  function handleLinkPointer(
    i: number,
    link: SLink,
    e: PointerEvent<SVGPathElement>,
  ) {
    setHoveredLink(i);
    const src = link.source as SNode;
    const tgt = link.target as SNode;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 40,
        from: src.name,
        to: tgt.name,
        value: link.value,
      });
    }
  }

  function clearHover() {
    setHoveredLink(null);
    setTooltip(null);
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('sankeyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={containerRef} className="relative w-full overflow-hidden">
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              style={isRTL ? { transform: 'scaleX(-1)' } : undefined}
              role="img"
              aria-label={t('sankeyTitle')}
            >
              {/* Links */}
              <g>
                {graph.links.map((link, i) => {
                  const src = link.source as SNode;
                  const tgt = link.target as SNode;
                  return (
                    <path
                      key={i}
                      d={linkPath(link as Parameters<typeof linkPath>[0]) ?? ''}
                      fill="none"
                      stroke={src.color}
                      strokeOpacity={activeLink === i ? 0.5 : 0.15}
                      strokeWidth={Math.max(1, link.width ?? 1)}
                      onPointerEnter={(e) => handleLinkPointer(i, link, e)}
                      onPointerLeave={clearHover}
                      tabIndex={0}
                      role="link"
                      aria-label={`${src.name} → ${tgt.name}: ${formatCurrency(link.value)}`}
                      onFocus={() => setFocusedLink(i)}
                      onBlur={() => { if (focusedLink === i) { setFocusedLink(null); setTooltip(null); } }}
                      onKeyDown={(e) => handleLinkKeyDown(e, i, link)}
                      className="cursor-pointer transition-[stroke-opacity] duration-150 focus:outline-none focus-visible:stroke-opacity-50"
                    />
                  );
                })}
              </g>

              {/* Nodes */}
              <g>
                {graph.nodes.map((node, i) => {
                  const x0 = node.x0 ?? 0;
                  const x1 = node.x1 ?? 0;
                  const y0 = node.y0 ?? 0;
                  const y1 = node.y1 ?? 0;
                  const h = y1 - y0;
                  const isSource = i === 0;
                  const isBudget = (node.depth ?? 0) >= 2;

                  // Position label outside the node rect
                  const labelX = isSource ? x0 - 6 : isBudget ? x1 + 6 : (x0 + x1) / 2;
                  const labelAnchor = isSource ? 'end' : isBudget ? 'start' : 'middle';

                  return (
                    <g key={i}>
                      <rect
                        x={x0}
                        y={y0}
                        width={x1 - x0}
                        height={Math.max(1, h)}
                        fill={node.color}
                        rx={2}
                        opacity={0.9}
                      />
                      {h > 12 && (
                        <text
                          x={labelX}
                          y={(y0 + y1) / 2}
                          textAnchor={labelAnchor}
                          dominantBaseline="middle"
                          fill="currentColor"
                          fontSize={11}
                          className="pointer-events-none select-none"
                          // Counter-mirror text so it reads correctly in RTL
                          transform={
                            isRTL
                              ? `translate(${labelX * 2}, 0) scale(-1, 1)`
                              : undefined
                          }
                          style={
                            isRTL
                              ? { transformOrigin: `0px ${(y0 + y1) / 2}px` }
                              : undefined
                          }
                        >
                          {node.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                role="status"
                aria-live="polite"
                className="absolute z-10 pointer-events-none rounded-md border bg-card px-3 py-2 text-xs shadow-lg"
                style={{
                  left: Math.max(8, Math.min(tooltip.x, width - 150)),
                  top: Math.max(0, tooltip.y),
                  transform: 'translateX(-50%)',
                }}
              >
                <p className="font-semibold">
                  {tooltip.from} → {tooltip.to}
                </p>
                <p className="text-muted-foreground">
                  {formatCurrency(tooltip.value)}
                </p>
              </div>
            )}

            <AccessibleDataTable
              caption={t('sankeyTitle')}
              columns={[
                { key: 'from', label: isRTL ? 'מקור' : 'From' },
                { key: 'to', label: isRTL ? 'יעד' : 'To' },
                { key: 'amount', label: isRTL ? 'סכום' : 'Amount' },
              ]}
              rows={flowTableRows}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
