'use client';

import { CostOfLivingSection } from '@/components/sections/cost-of-living-section';
import { HousingCrisisSection } from '@/components/sections/housing-crisis-section';
import { CentralBankSection } from '@/components/sections/central-bank-section';
import { TalkingPointsDebunker } from '@/components/sections/talking-points-debunker';
import { ShareCard } from '@/components/action/share-card';

export function LearnPageClient() {
  return (
    <>
      <CostOfLivingSection />
      <HousingCrisisSection />
      <CentralBankSection />
      <TalkingPointsDebunker />
      <div className="py-8">
        <ShareCard />
      </div>
    </>
  );
}
