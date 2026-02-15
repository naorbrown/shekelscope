'use client';

import { useMemo, useRef, useEffect } from 'react';
import { pie, arc } from 'd3-shape';
import { useTranslations, useLocale } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatPercent } from '@/components/shared/currency-display';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { AccessibleDataTable } from '@/components/charts/accessible-data-table';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6'];

interface SliceData {
  name: string;
  value: number;
  color: string;
}

export function TaxDonut() {
  const t = useTranslations('dashboard');
  const tResults = useTranslations('results');
  const locale = useLocale();
  const isHe = locale === 'he';
  const { result, displayMode } = useCalculatorStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const divisor = displayMode === 'monthly' ? 12 : 1;

  const data: SliceData[] = useMemo(() => {
    if (!result) return [];
    const slices: SliceData[] = [
      {
        name: tResults('incomeTax'),
        value: Math.round(result.incomeTax.netTax / divisor),
        color: COLORS[0],
      },
      {
        name: tResults('nationalInsurance'),
        value: Math.round(result.nationalInsurance.employeeContribution / divisor),
        color: COLORS[1],
      },
      {
        name: tResults('healthTax'),
        value: Math.round(result.healthTax.contribution / divisor),
        color: COLORS[2],
      },
    ];

    if (result.vat) {
      slices.push({
        name: tResults('vatEstimate'),
        value: Math.round(result.vat.annualVatPaid / divisor),
        color: COLORS[3],
      });
    }

    return slices.filter((s) => s.value > 0);
  }, [result, divisor, tResults]);

  const totalTax = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = svgRef.current;
    const width = 220;
    const height = 220;
    const outerRadius = 100;
    const innerRadius = 70;

    // Clear existing content
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${width / 2},${height / 2})`);

    const pieGen = pie<SliceData>()
      .value((d) => d.value)
      .padAngle(0.03)
      .sort(null);

    const arcGen = arc<{ startAngle: number; endAngle: number }>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(2);

    const arcs = pieGen(data);

    for (const d of arcs) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', arcGen(d) ?? '');
      path.setAttribute('fill', d.data.color);
      path.setAttribute('stroke', 'none');

      // Tooltip on hover
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${d.data.name}: ${formatCurrency(d.data.value)}`;
      path.appendChild(title);

      g.appendChild(path);
    }

    svg.appendChild(g);
  }, [data]);

  if (!result) return null;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('donutTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative h-[280px] w-full max-w-[320px] flex items-center justify-center">
              <svg
                ref={svgRef}
                viewBox="0 0 220 220"
                className="w-full h-auto max-w-[220px]"
                role="img"
                aria-label={t('donutTitle')}
              />
              {/* Center label */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-muted-foreground text-xs">
                  {displayMode === 'monthly' ? tResults('totalTaxMonthly') : tResults('totalTaxAnnual')}
                </p>
                <p className="text-xl font-bold">{formatCurrency(totalTax)}</p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-muted-foreground text-sm">
                {tResults('effectiveRate')}
              </p>
              <p className="text-2xl font-bold">
                {formatPercent(result.totalEffectiveRate)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 w-full text-left">
              {data.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-md p-2"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">
                    {entry.name}: {formatCurrency(entry.value)}
                  </span>
                </div>
              ))}
            </div>

            <AccessibleDataTable
              caption={t('donutTitle')}
              columns={[
                { key: 'name', label: isHe ? 'סוג מס' : 'Tax Type' },
                { key: 'amount', label: isHe ? 'סכום' : 'Amount' },
              ]}
              rows={data.map((d) => ({
                name: d.name,
                amount: formatCurrency(d.value),
              }))}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
