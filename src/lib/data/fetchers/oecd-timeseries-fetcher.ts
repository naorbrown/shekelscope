'use client';

import { useQuery } from '@tanstack/react-query';
import timeseriesStatic from '@/lib/data/oecd-timeseries.json';
import type { OECDTimeSeriesData, TimeSeriesDataPoint } from '@/lib/data/types';
import type { FetchResult } from './types';

const OECD_SOURCE_URL = 'https://data.oecd.org';

function makeStaticFallback(): FetchResult<OECDTimeSeriesData> {
  return {
    data: timeseriesStatic as OECDTimeSeriesData,
    lastUpdated: timeseriesStatic.lastUpdated,
    source: 'Local data',
    sourceUrl: OECD_SOURCE_URL,
    isLive: false,
  };
}

async function fetchOECDTimeSeries(): Promise<FetchResult<OECDTimeSeriesData>> {
  try {
    // OECD SDMX-JSON API for tax-to-GDP time series (Israel, 2015-2023)
    const res = await fetch(
      'https://stats.oecd.org/SDMX-JSON/data/REV/NES.TAXGDP.TOTALTAX/ISR+OECD.A?startTime=2015&endTime=2023',
      { signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) throw new Error(`OECD API ${res.status}`);

    const json = await res.json();
    const transformed = transformTimeSeries(json);
    if (!transformed || transformed.length === 0) throw new Error('Transform failed');

    return {
      data: {
        ...timeseriesStatic,
        taxToGDP: transformed,
      } as OECDTimeSeriesData,
      lastUpdated: new Date().toISOString(),
      source: 'OECD Stats',
      sourceUrl: OECD_SOURCE_URL,
      isLive: true,
    };
  } catch {
    return makeStaticFallback();
  }
}

function transformTimeSeries(
  json: Record<string, unknown>
): TimeSeriesDataPoint[] | null {
  try {
    const dataSets = json.dataSets as Array<{
      series: Record<string, { observations: Record<string, number[]> }>;
    }>;
    if (!dataSets?.[0]?.series) return null;

    const structure = json.structure as {
      dimensions: {
        series: Array<{ id: string; values: Array<{ id: string; name: string }> }>;
        observation: Array<{ values: Array<{ id: string; name: string }> }>;
      };
    };

    // Find the country dimension
    const countryDim = structure?.dimensions?.series?.find(
      (d) => d.values.some((v) => v.id === 'ISR' || v.name === 'Israel')
    );
    if (!countryDim) return null;

    // Find time dimension (observation level)
    const timeDim = structure?.dimensions?.observation?.[0];
    if (!timeDim) return null;

    const years = timeDim.values.map((v) => parseInt(v.id || v.name));

    // Extract Israel and OECD data
    const series = dataSets[0].series;
    const israelData: Record<number, number> = {};
    const oecdData: Record<number, number> = {};

    for (const [key, val] of Object.entries(series)) {
      const indices = key.split(':').map(Number);
      const countryIdx = indices.findIndex(
        (_, i) => structure.dimensions.series[i] === countryDim
      );
      const countryId = countryDim.values[indices[countryIdx]]?.id;

      for (const [obsIdx, obsVal] of Object.entries(val.observations)) {
        const year = years[parseInt(obsIdx)];
        const value = obsVal[0];
        if (typeof value === 'number' && !isNaN(year)) {
          if (countryId === 'ISR') {
            israelData[year] = Math.round(value * 10) / 10;
          } else if (countryId === 'OECD') {
            oecdData[year] = Math.round(value * 10) / 10;
          }
        }
      }
    }

    const result: TimeSeriesDataPoint[] = [];
    for (const year of years) {
      if (israelData[year] !== undefined && oecdData[year] !== undefined) {
        result.push({
          year,
          israel: israelData[year],
          oecdAverage: oecdData[year],
        });
      }
    }

    return result.length > 0 ? result.sort((a, b) => a.year - b.year) : null;
  } catch {
    return null;
  }
}

export function useOECDTimeSeries() {
  return useQuery({
    queryKey: ['oecd-timeseries'],
    queryFn: fetchOECDTimeSeries,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: makeStaticFallback(),
  });
}
