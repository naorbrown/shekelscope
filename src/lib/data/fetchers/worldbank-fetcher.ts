'use client';

import { useQuery } from '@tanstack/react-query';
import oecdStatic from '@/lib/data/oecd-comparison.json';
import type { FetchResult } from './types';

interface GovernanceData {
  israel: number;
  oecdAverage: number;
  source: string;
}

const WORLDBANK_SOURCE_URL = 'https://data.worldbank.org';

function makeStaticFallback(): FetchResult<GovernanceData> {
  return {
    data: oecdStatic.governmentEfficiency,
    lastUpdated: oecdStatic.lastUpdated,
    source: 'Local data',
    sourceUrl: WORLDBANK_SOURCE_URL,
    isLive: false,
  };
}

async function fetchGovernanceData(): Promise<FetchResult<GovernanceData>> {
  try {
    // World Bank Governance Indicator: Government Effectiveness
    const res = await fetch(
      'https://api.worldbank.org/v2/country/ISR/indicator/GE.EST?format=json&per_page=1&mrv=1',
      { signal: AbortSignal.timeout(8000) }
    );

    if (!res.ok) throw new Error(`World Bank API ${res.status}`);

    const json = (await res.json()) as [
      { page: number },
      Array<{ value: number | null; date: string }> | null,
    ];

    const records = json[1];
    if (!records || records.length === 0 || records[0].value === null) {
      throw new Error('No data');
    }

    // WB returns percentile rank 0-100
    const israelScore = Math.round(records[0].value);

    return {
      data: {
        israel: israelScore,
        oecdAverage: oecdStatic.governmentEfficiency.oecdAverage,
        source: 'World Bank Worldwide Governance Indicators',
      },
      lastUpdated: new Date().toISOString(),
      source: 'World Bank',
      sourceUrl: WORLDBANK_SOURCE_URL,
      isLive: true,
    };
  } catch {
    return makeStaticFallback();
  }
}

export function useGovernanceData() {
  return useQuery({
    queryKey: ['governance-effectiveness'],
    queryFn: fetchGovernanceData,
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: makeStaticFallback(),
  });
}
