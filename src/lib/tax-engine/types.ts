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
}

// --- Rate data types (mirror JSON structure) ---

export interface TaxBracket {
  floor: number;
  ceiling: number | null;
  rate: number;
}

export interface SurtaxConfig {
  threshold: number;
  rate: number;
}

export interface TaxRatesData {
  taxYear: number;
  incomeTaxBrackets: TaxBracket[];
  surtax: SurtaxConfig;
}

export interface NIRateTier {
  nationalInsurance: number;
  healthInsurance: number;
  total: number;
}

export interface NationalInsuranceData {
  averageWageMonthly: number;
  reducedRateThreshold: { monthly: number; annual: number };
  maxInsurableIncome: { monthly: number; annual: number };
  employee: { reduced: NIRateTier; full: NIRateTier };
  employer: { reduced: NIRateTier; full: NIRateTier };
  selfEmployed: {
    reduced: NIRateTier;
    full: NIRateTier;
    exemptionThreshold: { monthly: number; annual: number };
  };
}

export interface TaxCreditsData {
  pointValueAnnual: number;
  pointValueMonthly: number;
  baseCredits: { resident: number; womanAdditional: number };
  childCredits: { description: string; motherPoints: number; fatherPoints: number }[];
  childAgeRanges: { minAge: number; maxAge: number; index: number }[];
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
}
