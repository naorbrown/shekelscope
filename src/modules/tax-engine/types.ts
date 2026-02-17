// Re-import rate data types from the canonical Zod-inferred source
export type {
  TaxRatesData,
  NationalInsuranceData,
  TaxCreditsData,
} from '../data/types';

// --- Input types ---

export type EmploymentType = 'employee' | 'selfEmployed';
export type Gender = 'male' | 'female';
export type TaxYear = 2025;

export interface TaxpayerProfile {
  annualGrossIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  taxYear: TaxYear;
  childAges?: number[];
  pensionContributionRate?: number;
  monthlyConsumerSpending?: number;
  cityId?: string;
}

// --- Result types ---

export interface BracketResult {
  floor: number;
  ceiling: number | null;
  rate: number;
  taxableInBracket: number;
  taxInBracket: number;
}

export interface IncomeTaxResult {
  grossTax: number;
  surtax: number;
  creditPointsValue: number;
  netTax: number;
  effectiveRate: number;
  brackets: BracketResult[];
}

export interface NationalInsuranceResult {
  employeeContribution: number;
  employerContribution: number;
  reducedPortionEmployee: number;
  fullPortionEmployee: number;
  effectiveRate: number;
}

export interface HealthTaxResult {
  contribution: number;
  reducedPortion: number;
  fullPortion: number;
  effectiveRate: number;
}

export interface TaxCreditResult {
  totalPoints: number;
  pointValue: number;
  totalCreditValue: number;
  breakdown: { category: string; points: number }[];
}

export interface VatResult {
  rate: number;
  annualVatPaid: number;
}

export interface ArnonaResult {
  annualAmount: number;
  monthlyAmount: number;
  cityId: string;
  cityNameEn: string;
  cityNameHe: string;
  ratePerSqm: number;
}

export interface BudgetAllocationResult {
  id: string;
  nameEn: string;
  nameHe: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface TotalTaxResult {
  grossIncome: number;
  incomeTax: IncomeTaxResult;
  nationalInsurance: NationalInsuranceResult;
  healthTax: HealthTaxResult;
  taxCredits: TaxCreditResult;
  vat: VatResult | null;
  totalDeductions: number;
  netIncome: number;
  totalEffectiveRate: number;
  monthlyGross: number;
  monthlyNet: number;
  dailyTax: number;
  employerCost: number;
  budgetAllocation: BudgetAllocationResult[];
  arnona: ArnonaResult | null;
}
