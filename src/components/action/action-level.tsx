'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
              {config.items.map((item) => (
                <div
                  key={item.translationKey}
                  className="rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {t(`${item.translationKey}.title`)}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {t(`${item.translationKey}.description`)}
                      </p>
                    </div>
                    {item.url && (
                      <Button
                        variant="outline"
                        size="xs"
                        asChild
                        className="shrink-0"
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export { LEVEL_CONFIGS };
