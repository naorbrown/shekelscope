import type { IncomeTaxResult, BracketResult } from './types';
import type { TaxRatesData } from '../data/types';
import { roundToAgora } from './utils';

type TaxBracket = TaxRatesData['incomeTaxBrackets'][number];
type SurtaxConfig = TaxRatesData['surtax'];

export function calculateIncomeTax(
  annualGrossIncome: number,
  brackets: TaxBracket[],
  surtax: SurtaxConfig,
  creditPointsValue: number
): IncomeTaxResult {
  if (annualGrossIncome <= 0) {
    return {
      grossTax: 0,
      surtax: 0,
      creditPointsValue,
      netTax: 0,
      effectiveRate: 0,
      brackets: [],
    };
  }

  const bracketResults: BracketResult[] = [];
  let grossTax = 0;

  for (const bracket of brackets) {
    const ceiling = bracket.ceiling ?? Infinity;
    if (annualGrossIncome <= bracket.floor) break;

    const taxableInBracket = Math.min(annualGrossIncome, ceiling) - bracket.floor;
    const taxInBracket = roundToAgora(taxableInBracket * bracket.rate);

    bracketResults.push({
      floor: bracket.floor,
      ceiling: bracket.ceiling,
      rate: bracket.rate,
      taxableInBracket,
      taxInBracket,
    });

    grossTax += taxInBracket;
  }

  const surtaxAmount =
    annualGrossIncome > surtax.threshold
      ? roundToAgora((annualGrossIncome - surtax.threshold) * surtax.rate)
      : 0;

  grossTax = roundToAgora(grossTax + surtaxAmount);
  const netTax = roundToAgora(Math.max(0, grossTax - creditPointsValue));
  const effectiveRate = annualGrossIncome > 0 ? netTax / annualGrossIncome : 0;

  return {
    grossTax,
    surtax: surtaxAmount,
    creditPointsValue,
    netTax,
    effectiveRate,
    brackets: bracketResults,
  };
}
