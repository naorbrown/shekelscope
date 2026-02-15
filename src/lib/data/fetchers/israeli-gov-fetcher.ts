'use client';

import { useQuery } from '@tanstack/react-query';
import budgetStatic from '@/lib/data/budget-2025.json';
import type { FetchResult } from './types';

interface BudgetSummary {
  totalBudgetBillionNIS: number;
  taxYear: number;
  sourceUrl: string;
}

const GOV_SOURCE_URL = 'https://data.gov.il';

function makeStaticFallback(): FetchResult<BudgetSummary> {
  return {
    data: {
      totalBudgetBillionNIS: budgetStatic.totalBudgetBillionNIS,
      taxYear: budgetStatic.taxYear,
      sourceUrl: budgetStatic.sourceUrl,
    },
    lastUpdated: budgetStatic.lastUpdated,
    source: 'Local data',
    sourceUrl: GOV_SOURCE_URL,
    isLive: false,
  };
}

async function fetchBudgetSummary(): Promise<FetchResult<BudgetSummary>> {
  try {
    // data.gov.il CKAN API for budget data
    const res = await fetch(
      'https://data.gov.il/api/3/action/datastore_search?resource_id=budget-summary-2025&limit=1',
      { signal: AbortSignal.timeout(8000) }
    );

    if (!res.ok) throw new Error(`data.gov.il API ${res.status}`);

    const json = (await res.json()) as {
      success: boolean;
      result?: { records: Array<{ total_budget?: number }> };
    };

    if (!json.success || !json.result?.records?.[0]) {
      throw new Error('No data');
    }

    const record = json.result.records[0];
    const totalBudget = record.total_budget;

    if (typeof totalBudget !== 'number') {
      throw new Error('Invalid budget data');
    }

    return {
      data: {
        totalBudgetBillionNIS: Math.round(totalBudget / 1_000_000_000),
        taxYear: 2025,
        sourceUrl: budgetStatic.sourceUrl,
      },
      lastUpdated: new Date().toISOString(),
      source: 'data.gov.il',
      sourceUrl: GOV_SOURCE_URL,
      isLive: true,
    };
  } catch {
    return makeStaticFallback();
  }
}

export function useBudgetSummary() {
  return useQuery({
    queryKey: ['budget-summary'],
    queryFn: fetchBudgetSummary,
    staleTime: 1000 * 60 * 60 * 24,
    placeholderData: makeStaticFallback(),
  });
}
