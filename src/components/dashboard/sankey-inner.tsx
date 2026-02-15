'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import {
  sankey as d3Sankey,
  sankeyLinkHorizontal,
  type SankeyNode,
} from 'd3-sankey';
import { useLocale } from 'next-intl';
import { formatCurrency } from '@/components/shared/currency-display';
import type { TotalTaxResult } from '@/lib/tax-engine/types';

interface SankeyInnerProps {
  result: TotalTaxResult;
}

interface NodeDatum {
  name: string;
  color: string;
}

interface LinkDatum {
  source: number;
  target: number;
  value: number;
}

type SNode = SankeyNode<NodeDatum, LinkDatum>;

export function SankeyInner({ result }: SankeyInnerProps) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 450 });
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          setDimensions({ width, height: Math.max(350, Math.min(500, width * 0.6)) });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const { nodes, links } = useMemo(() => {
    // Node 0: Income
    // Nodes 1-3: Tax types (Income Tax, NI, Health)
    // Nodes 4+: Budget categories
    const nodeList: NodeDatum[] = [
      { name: locale === 'he' ? 'הכנסה' : 'Income', color: '#10b981' },
      {
        name: locale === 'he' ? 'מס הכנסה' : 'Income Tax',
        color: '#ef4444',
      },
      {
        name: locale === 'he' ? 'ביטוח לאומי' : 'National Insurance',
        color: '#f97316',
      },
      {
        name: locale === 'he' ? 'מס בריאות' : 'Health Tax',
        color: '#3b82f6',
      },
    ];

    const budgetStartIndex = nodeList.length;

    for (const alloc of result.budgetAllocation) {
      nodeList.push({
        name: locale === 'he' ? alloc.nameHe : alloc.nameEn,
        color: alloc.color,
      });
    }

    // Links from Income -> Tax Types
    const incomeTaxAmt = Math.max(0, result.incomeTax.netTax);
    const niAmt = result.nationalInsurance.employeeContribution;
    const healthAmt = result.healthTax.contribution;
    const totalTax = incomeTaxAmt + niAmt + healthAmt;

    const linkList: LinkDatum[] = [];

    if (incomeTaxAmt > 0) {
      linkList.push({ source: 0, target: 1, value: incomeTaxAmt });
    }
    if (niAmt > 0) {
      linkList.push({ source: 0, target: 2, value: niAmt });
    }
    if (healthAmt > 0) {
      linkList.push({ source: 0, target: 3, value: healthAmt });
    }

    // Links from Tax Types -> Budget Categories
    // Distribute proportionally from each tax type to each budget category
    if (totalTax > 0) {
      for (let i = 0; i < result.budgetAllocation.length; i++) {
        const alloc = result.budgetAllocation[i];
        const pct = alloc.percentage / 100;
        const targetIdx = budgetStartIndex + i;

        if (incomeTaxAmt > 0) {
          const val = incomeTaxAmt * pct;
          if (val > 0.5) linkList.push({ source: 1, target: targetIdx, value: val });
        }
        if (niAmt > 0) {
          const val = niAmt * pct;
          if (val > 0.5) linkList.push({ source: 2, target: targetIdx, value: val });
        }
        if (healthAmt > 0) {
          const val = healthAmt * pct;
          if (val > 0.5) linkList.push({ source: 3, target: targetIdx, value: val });
        }
      }
    }

    return { nodes: nodeList, links: linkList };
  }, [result, locale]);

  const graph = useMemo(() => {
    if (links.length === 0) return null;

    const sankeyGenerator = d3Sankey<NodeDatum, LinkDatum>()
      .nodeWidth(16)
      .nodePadding(8)
      .nodeAlign((node) => {
        // 3-column layout: income=0, taxes=1, budget=2
        const idx = (node as SNode).index ?? 0;
        if (idx === 0) return 0;
        if (idx <= 3) return 1;
        return 2;
      })
      .extent([
        [1, 1],
        [dimensions.width - 1, dimensions.height - 6],
      ]);

    const graphResult = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });

    return graphResult;
  }, [nodes, links, dimensions]);

  if (!graph || links.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  const linkPath = sankeyLinkHorizontal();

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      >
        {/* Links */}
        <g>
          {graph.links.map((link, i) => {
            const sourceNode = link.source as SNode;
            return (
              <path
                key={`link-${i}`}
                d={linkPath(link as never) || ''}
                fill="none"
                stroke={sourceNode.color}
                strokeOpacity={0.25}
                strokeWidth={Math.max(1, link.width ?? 1)}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top - 30,
                      text: `${sourceNode.name} → ${(link.target as SNode).name}: ${formatCurrency(link.value)}`,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
                className="transition-opacity hover:stroke-opacity-50 cursor-pointer"
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
            const height = y1 - y0;

            return (
              <g key={`node-${i}`}>
                <rect
                  x={x0}
                  y={y0}
                  width={x1 - x0}
                  height={Math.max(1, height)}
                  fill={node.color}
                  rx={2}
                  opacity={0.9}
                />
                {height > 14 && (
                  <text
                    x={i === 0 ? x0 - 6 : i <= 3 ? (x0 + x1) / 2 : x1 + 6}
                    y={(y0 + y1) / 2}
                    textAnchor={i === 0 ? 'end' : i <= 3 ? 'middle' : 'start'}
                    dominantBaseline="middle"
                    fill="currentColor"
                    fontSize={11}
                    className="pointer-events-none"
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
          className="pointer-events-none absolute z-10 rounded-md bg-card border px-2 py-1 text-xs shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
