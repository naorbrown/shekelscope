/**
 * Fetches latest OECD tax-to-GDP time-series data and updates
 * the static fallback file at src/lib/data/oecd-timeseries.json.
 *
 * Run: pnpm tsx scripts/update-oecd-data.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_PATH = resolve(__dirname, '../src/lib/data/oecd-timeseries.json');

interface TimeSeriesDataPoint {
  year: number;
  israel: number;
  oecdAverage: number;
}

async function fetchTaxToGDP(): Promise<TimeSeriesDataPoint[] | null> {
  try {
    const url =
      'https://stats.oecd.org/SDMX-JSON/data/REV/NES.TAXGDP.TOTALTAX/ISR+OECD.A?startTime=2015&endTime=2024';

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.error(`OECD API responded with ${res.status}`);
      return null;
    }

    const json = await res.json();
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

    const countryDim = structure?.dimensions?.series?.find((d) =>
      d.values.some((v) => v.id === 'ISR' || v.name === 'Israel')
    );
    if (!countryDim) return null;

    const timeDim = structure?.dimensions?.observation?.[0];
    if (!timeDim) return null;
    const years = timeDim.values.map((v) => parseInt(v.id || v.name));

    const israelData: Record<number, number> = {};
    const oecdData: Record<number, number> = {};

    const series = dataSets[0].series;
    for (const [key, val] of Object.entries(series)) {
      const indices = key.split(':').map(Number);
      const countryDimIdx = structure.dimensions.series.indexOf(countryDim);
      const countryId = countryDim.values[indices[countryDimIdx]]?.id;

      for (const [obsIdx, obsVal] of Object.entries(val.observations)) {
        const year = years[parseInt(obsIdx)];
        const value = obsVal[0];
        if (typeof value === 'number' && !isNaN(year)) {
          if (countryId === 'ISR') israelData[year] = Math.round(value * 10) / 10;
          else if (countryId === 'OECD') oecdData[year] = Math.round(value * 10) / 10;
        }
      }
    }

    const result: TimeSeriesDataPoint[] = [];
    for (const year of years) {
      if (israelData[year] !== undefined && oecdData[year] !== undefined) {
        result.push({ year, israel: israelData[year], oecdAverage: oecdData[year] });
      }
    }

    return result.length > 0 ? result.sort((a, b) => a.year - b.year) : null;
  } catch (err) {
    console.error('Failed to fetch OECD data:', err);
    return null;
  }
}

async function main() {
  console.log('Fetching OECD tax-to-GDP time-series data...');

  const taxToGDP = await fetchTaxToGDP();

  if (!taxToGDP) {
    console.log('No new data fetched — keeping existing file.');
    return;
  }

  console.log(`Fetched ${taxToGDP.length} data points for tax-to-GDP.`);

  // Read existing file to preserve other series
  const existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const updated = {
    ...existing,
    taxToGDP,
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2) + '\n');
  console.log('Updated src/lib/data/oecd-timeseries.json');
}

main();
