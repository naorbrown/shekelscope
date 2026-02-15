'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useCalculatorStore } from '@/lib/store/calculator-store';
import { ExternalLink, Check } from 'lucide-react';
import { ReminderDialog } from './reminder-dialog';

interface ActionItemConfig {
  translationKey: string;
  url?: string;
}

interface ActionLevelConfig {
  id: string;
  items: ActionItemConfig[];
}

// Map level IDs to their translation sub-keys and external URLs.
// Translation keys are relative to `action.levels.<levelId>`.
const LEVEL_CONFIGS: ActionLevelConfig[] = [
  {
    id: 'mindset',
    items: [
      { translationKey: 'economicLiteracy' },
      { translationKey: 'personalResponsibility' },
      { translationKey: 'loveYourNeighbor' },
      { translationKey: 'seeEgo' },
    ],
  },
  {
    id: 'educate',
    items: [
      { translationKey: 'shareTool' },
      { translationKey: 'talkToFamily' },
      { translationKey: 'socialMedia' },
    ],
  },
  {
    id: 'civic',
    items: [
      { translationKey: 'contactMK', url: 'https://main.knesset.gov.il/mk/current/Pages/default.aspx' },
      { translationKey: 'fileFOI', url: 'https://foi.gov.il/' },
      { translationKey: 'municipal' },
      { translationKey: 'referendum' },
    ],
  },
  {
    id: 'organize',
    items: [
      { translationKey: 'joinGroups', url: 'https://en.idi.org.il' },
      { translationKey: 'protest' },
    ],
  },
  {
    id: 'vote',
    items: [
      { translationKey: 'research' },
      { translationKey: 'turnout' },
    ],
  },
];

interface ActionLevelProps {
  levelIndex: number;
}

export function ActionLevel({ levelIndex }: ActionLevelProps) {
  const config = LEVEL_CONFIGS[levelIndex];
  const t = useTranslations(`action.levels.${config.id}`);
  const { completedActions, toggleAction } = useCalculatorStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: levelIndex * 0.1 }}
      className="relative"
    >
      <div className="flex gap-4">
        {/* Step indicator */}
        <div className="flex flex-col items-center">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {levelIndex + 1}
          </div>
          {levelIndex < LEVEL_CONFIGS.length - 1 && (
            <div className="w-px flex-1 bg-border" />
          )}
        </div>

        {/* Content */}
        <Card className="mb-6 flex-1">
          <CardHeader>
            <CardTitle className="text-lg">{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {config.items.map((item) => {
                const actionId = `${config.id}.${item.translationKey}`;
                const isCompleted = completedActions.some(
                  (a) => a.actionId === actionId
                );

                return (
                  <div
                    key={item.translationKey}
                    className={`rounded-lg border p-3 transition-colors ${
                      isCompleted
                        ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/30'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isCompleted}
                        onCheckedChange={() => toggleAction(actionId)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm font-medium ${
                            isCompleted
                              ? 'text-green-700 dark:text-green-300 line-through'
                              : 'text-foreground'
                          }`}
                        >
                          {t(`${item.translationKey}.title`)}
                          {isCompleted && (
                            <Check className="inline size-3.5 ms-1.5 text-green-600" />
                          )}
                        </p>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {t(`${item.translationKey}.description`)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!isCompleted && (
                          <ReminderDialog actionId={actionId} />
                        )}
                        {item.url && (
                          <Button
                            variant="outline"
                            size="xs"
                            asChild
                          >
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="size-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export { LEVEL_CONFIGS };
