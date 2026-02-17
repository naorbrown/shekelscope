'use client';

import type { ActionResourcesData } from '@/modules/data/types';
import { getContent, CONTENT } from '@/content';
import { ActionLevelCard } from './action-level-card';

interface ActionSectionProps {
  actionResources: ActionResourcesData;
}

export function ActionSection({ actionResources }: ActionSectionProps) {
  return (
    <section>
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold">
          {getContent(CONTENT.SECTION_ACTIONS_TITLE)}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {getContent(CONTENT.SECTION_ACTIONS_SUBTITLE)}
        </p>
      </div>

      <div className="space-y-4">
        {actionResources.levels.map((level, index) => (
          <ActionLevelCard key={level.id} level={level} stepNumber={index + 1} />
        ))}
      </div>
    </section>
  );
}
