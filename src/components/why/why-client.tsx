'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Accordion } from '@/components/ui/accordion';
import { TopicSection } from '@/components/why/topic-section';

const TOPIC_KEYS = [
  'housing',
  'costOfLiving',
  'healthcare',
  'education',
  'whyOlimLeave',
  'priceSalaryRatio',
  'butterflyEffect',
] as const;

export function WhyClient() {
  const t = useTranslations('why');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Accordion Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {TOPIC_KEYS.map((key, i) => (
            <TopicSection key={key} topicKey={key} index={i} />
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
}
