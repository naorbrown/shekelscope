'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Landmark, FileSearch, ShieldCheck, Building, Receipt, Scale } from 'lucide-react';
import civicData from '@/lib/data/civic-platforms.json';

const ICON_MAP: Record<string, React.ElementType> = {
  landmark: Landmark,
  fileSearch: FileSearch,
  shieldCheck: ShieldCheck,
  building: Building,
  receipt: Receipt,
  scale: Scale,
};

export function KnessetContact() {
  const locale = useLocale();
  const isHe = locale === 'he';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isHe ? 'פלטפורמות אזרחיות' : 'Civic Platforms'}
          </CardTitle>
          <CardDescription>
            {isHe
              ? 'ערוצים ישירים לפעולה אזרחית ומעורבות'
              : 'Direct channels for civic action and engagement'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {civicData.platforms.map((platform) => {
              const Icon = ICON_MAP[platform.icon] ?? ExternalLink;

              return (
                <div
                  key={platform.id}
                  className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {isHe ? platform.nameHe : platform.nameEn}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isHe ? platform.descriptionHe : platform.descriptionEn}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="xs" asChild>
                        <a
                          href={platform.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-1"
                        >
                          <ExternalLink className="size-3" />
                          {isHe ? 'אתר' : 'Visit'}
                        </a>
                      </Button>
                      {'contactUrl' in platform && platform.contactUrl && (
                        <Button variant="outline" size="xs" asChild>
                          <a
                            href={platform.contactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-1"
                          >
                            <ExternalLink className="size-3" />
                            {isHe ? 'צרו קשר' : 'Contact'}
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
    </motion.div>
  );
}
