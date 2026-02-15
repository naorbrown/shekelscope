'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { TotalTaxResult } from '@/lib/tax-engine/types';

const SankeyInner = dynamic(
  () => import('./sankey-inner').then((mod) => mod.SankeyInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[350px] items-center justify-center text-muted-foreground">
        Loading diagram...
      </div>
    ),
  }
);

interface SankeyDiagramProps {
  result: TotalTaxResult;
}

export function SankeyDiagram({ result }: SankeyDiagramProps) {
  const t = useTranslations('dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{t('sankeyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <SankeyInner result={result} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
