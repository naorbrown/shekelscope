'use client';

import { useState } from 'react';
import type { ActionResourcesData } from '@/modules/data/types';
import { getContent, CONTENT } from '@/content';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ActionLevel = ActionResourcesData['levels'][number];

interface ActionLevelCardProps {
  level: ActionLevel;
  stepNumber: number;
}

export function ActionLevelCard({ level, stepNumber }: ActionLevelCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="py-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="shrink-0 text-xs">
            {stepNumber}
          </Badge>
          <div>
            <h3 className="font-semibold">
              {getContent(CONTENT.actionLevel(level.id))}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getContent(CONTENT.actionLevelDescription(level.id))}
            </p>
          </div>
        </div>

        {expanded && (
          <ul className="mt-4 space-y-2 pl-9">
            {level.actions.map((action) => (
              <li key={action.id} className="text-sm">
                {action.url ? (
                  <a
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-primary/80"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getContent(CONTENT.actionItem(action.key))}
                  </a>
                ) : (
                  <span>{getContent(CONTENT.actionItem(action.key))}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
