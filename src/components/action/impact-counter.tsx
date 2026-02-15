'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Share2 } from 'lucide-react';
import { useCalculatorStore } from '@/lib/store/calculator-store';

/**
 * Local-only impact counter.
 * Counts the user's own calculations and completed actions.
 * A server-backed aggregate counter can be added later (e.g. Cloudflare Worker + D1).
 */
export function ImpactCounter() {
  const locale = useLocale();
  const isHe = locale === 'he';
  const { completedActions, hasCalculated } = useCalculatorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const actionsCount = completedActions.length;

  const stats = [
    {
      icon: Calculator,
      value: hasCalculated ? '1' : '0',
      label: isHe ? 'חישובים שביצעתם' : 'Your calculations',
    },
    {
      icon: Share2,
      value: String(actionsCount),
      label: isHe ? 'פעולות אזרחיות שהושלמו' : 'Civic actions completed',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
