'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionWrapper } from './section-wrapper';
import { MessageCircleQuestion, CheckCircle, Lightbulb } from 'lucide-react';
import talkingPointsData from '@/lib/data/talking-points.json';

export function TalkingPointsDebunker() {
  const t = useTranslations('sections.debunker');

  return (
    <SectionWrapper
      id="debunker"
      title={t('title')}
      subtitle={t('subtitle')}
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        {talkingPointsData.points.map((point, index) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * index }}
          >
            <AccordionItem
              value={point.id}
              className="rounded-lg border bg-card px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <MessageCircleQuestion className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {t('theySayLabel')}:
                    </span>
                    <p className="text-sm font-semibold mt-0.5">
                      &ldquo;{point.theySay}&rdquo;
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pb-2">
                  {/* Reality */}
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                        {t('realityLabel')}:
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {point.reality}
                      </p>
                    </div>
                  </div>

                  {/* Ask instead */}
                  <div className="flex gap-3 rounded-md bg-blue-50 dark:bg-blue-950/30 p-3">
                    <Lightbulb className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        {t('askInsteadLabel')}:
                      </span>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mt-1">
                        {point.askInstead}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </SectionWrapper>
  );
}
