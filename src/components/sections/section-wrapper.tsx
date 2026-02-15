'use client';

import { motion } from 'framer-motion';
import { useCalculatorStore } from '@/lib/store/calculator-store';

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  requiresCalculation?: boolean;
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  title,
  subtitle,
  requiresCalculation = false,
  children,
}: SectionWrapperProps) {
  const result = useCalculatorStore((s) => s.result);

  if (requiresCalculation && !result) return null;

  return (
    <section id={id} className="scroll-mt-20 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </motion.div>
    </section>
  );
}
