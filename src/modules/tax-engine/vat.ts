import type { VatResult } from './types';
import { roundToAgora } from './utils';

export function calculateVat(
  annualNetIncome: number,
  vatRate: number,
  savingsRate: number = 0.2
): VatResult {
  // Estimate annual spending as net income minus estimated savings
  const annualSpending = annualNetIncome * (1 - savingsRate);
  // VAT is included in prices, so actual VAT paid = spending * (rate / (1 + rate))
  const annualVatPaid = roundToAgora(annualSpending * (vatRate / (1 + vatRate)));

  return {
    rate: vatRate,
    annualVatPaid,
  };
}
