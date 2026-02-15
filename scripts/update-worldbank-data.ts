/**
 * Fetches latest World Bank governance data and updates
 * the static fallback file at src/lib/data/oecd-comparison.json.
 *
 * Run: pnpm tsx scripts/update-worldbank-data.ts
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DATA_PATH = resolve(__dirname, '../src/lib/data/oecd-comparison.json');

async function fetchGovernanceEffectiveness(): Promise<number | null> {
  try {
    const url =
      'https://api.worldbank.org/v2/country/ISR/indicator/GE.EST?format=json&per_page=1&mrv=1';

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.error(`World Bank API responded with ${res.status}`);
      return null;
    }

    const json = (await res.json()) as [
      { page: number },
      Array<{ value: number | null; date: string }> | null,
    ];

    const records = json[1];
    if (!records || records.length === 0 || records[0].value === null) {
      return null;
    }

    // World Bank returns percentile rank 0-100
    return Math.round(records[0].value);
  } catch (err) {
    console.error('Failed to fetch World Bank data:', err);
    return null;
  }
}

async function main() {
  console.log('Fetching World Bank governance effectiveness data...');

  const score = await fetchGovernanceEffectiveness();

  if (score === null) {
    console.log('No new data fetched — keeping existing file.');
    return;
  }

  console.log(`Israel governance effectiveness score: ${score}`);

  const existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));

  const updated = {
    ...existing,
    governmentEfficiency: {
      ...existing.governmentEfficiency,
      israel: score,
    },
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2) + '\n');
  console.log('Updated src/lib/data/oecd-comparison.json');
}

main();
