'use client';

import { useQuery } from '@tanstack/react-query';
import oecdStatic from '@/lib/data/oecd-comparison.json';
import type { OECDComparisonData } from '@/lib/data/types';
import type { FetchResult } from './types';

const OECD_SOURCE_URL = 'https://data.oecd.org';

function makeStaticFallback(): FetchResult<OECDComparisonData> {
  return {
    data: oecdStatic as OECDComparisonData,
    lastUpdated: oecdStatic.lastUpdated,
    source: 'Local data',
    sourceUrl: OECD_SOURCE_URL,
    isLive: false,
  };
}

async function fetchOECDComparison(): Promise<FetchResult<OECDComparisonData>> {
  try {
    // OECD Stats SDMX-JSON API for tax revenue data
    const res = await fetch(
      'https://stats.oecd.org/SDMX-JSON/data/REV/NES.TAXGDP.TOTALTAX/AUS+DEU+FRA+GBR+ISR+SWE+CHE+SGP+USA.A?startTime=2022&endTime=2023',
      { signal: AbortSignal.timeout(8000) }
    );

    if (!res.ok) throw new Error(`OECD API ${res.status}`);

    const json = await res.json();

    // Transform SDMX-JSON into our data shape
    const transformed = transformOECDResponse(json);
    if (!transformed) throw new Error('OECD transform failed');

    return {
      data: {
        ...oecdStatic,
        taxToGDP: {
          ...oecdStatic.taxToGDP,
          countries: transformed.taxToGDP,
        },
      } as OECDComparisonData,
      lastUpdated: new Date().toISOString(),
      source: 'OECD Stats',
      sourceUrl: OECD_SOURCE_URL,
      isLive: true,
    };
  } catch {
    return makeStaticFallback();
  }
}

function transformOECDResponse(
  json: Record<string, unknown>
): { taxToGDP: Array<{ country: string; percentage: number }> } | null {
  try {
    // SDMX-JSON structure: dataSets[0].series -> observations
    const dataSets = json.dataSets as Array<{
      series: Record<string, { observations: Record<string, number[]> }>;
    }>;
    if (!dataSets?.[0]?.series) return null;

    const structure = json.structure as {
      dimensions: {
        series: Array<{ values: Array<{ name: string }> }>;
      };
    };
    const countryDim = structure?.dimensions?.series?.find(
      (d) => d.values.some((v) => v.name === 'Israel')
    );
    if (!countryDim) return null;

    const countries: Array<{ country: string; percentage: number }> = [];
    const series = dataSets[0].series;

    for (const [key, val] of Object.entries(series)) {
      const indices = key.split(':').map(Number);
      const countryIdx = indices[2]; // country is 3rd dimension
      const countryName = countryDim.values[countryIdx]?.name;
      if (!countryName) continue;

      // Get the latest observation
      const obs = Object.entries(val.observations);
      if (obs.length === 0) continue;
      const latestObs = obs[obs.length - 1];
      const value = latestObs[1][0];

      if (typeof value === 'number') {
        countries.push({ country: countryName, percentage: value });
      }
    }

    return countries.length > 0 ? { taxToGDP: countries } : null;
  } catch {
    return null;
  }
}

export function useOECDData() {
  return useQuery({
    queryKey: ['oecd-comparison'],
    queryFn: fetchOECDComparison,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: makeStaticFallback(),
  });
}
