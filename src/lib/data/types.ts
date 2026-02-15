// --- OECD Comparison Types ---

export interface CountryTaxToGDP {
  country: string;
  percentage: number;
}

export interface OECDTaxToGDP {
  israel: number;
  oecdAverage: number;
  countries: CountryTaxToGDP[];
}

export interface CountryAffordability {
  country: string;
  priceToIncomeRatio: number;
}

export interface OECDHousingAffordability {
  israel: number;
  oecdAverage: number;
  countries: CountryAffordability[];
  source: string;
}

export interface CountryHealthSpending {
  country: string;
  spendingPerCapitaUSD: number;
}

export interface OECDHealthcareSpending {
  israel: number;
  oecdAverage: number;
  countries: CountryHealthSpending[];
  source: string;
}

export interface OECDEducationSpending {
  spendingPerStudentUSD: {
    israel: number;
    us: number;
    oecdAverage: number;
  };
  pisaScores: {
    israel: number;
    oecdAverage: number;
  };
  source: string;
}

export interface OECDGovernmentEfficiency {
  israel: number;
  oecdAverage: number;
  source: string;
}

export interface OECDComparisonData {
  taxToGDP: OECDTaxToGDP;
  housingAffordability: OECDHousingAffordability;
  healthcareSpendingPerCapita: OECDHealthcareSpending;
  educationSpending: OECDEducationSpending;
  governmentEfficiency: OECDGovernmentEfficiency;
  sourceUrl: string;
  lastUpdated: string;
}

// --- Cost Analysis Types ---

export interface AnalysisSource {
  name: string;
  url: string;
}

export interface CategoryAnalysis {
  id: string;
  overheadPercent: number;
  reachesServicePercent: number;
  grade: string;
  alternativeCostMultiplier: number;
  issues: string;
  alternative: string;
  sources: AnalysisSource[];
}

export interface CostAnalysisData {
  lastUpdated: string;
  categories: CategoryAnalysis[];
}

// --- Housing Data Types ---

export interface PermitTimeComparison {
  country: string;
  days: number;
}

export interface HousingData {
  ilaLandControlPercent: number;
  averagePermitYears: number;
  priceToIncomeRatio: {
    israel: number;
    oecdAvg: number;
  };
  medianApartmentPriceTelAviv: number;
  medianApartmentPriceNational: number;
  priceGrowthLastDecadePercent: number;
  buildablePercentOfLand: number;
  permitTimeComparison: PermitTimeComparison[];
  sources: AnalysisSource[];
}

// --- Cost of Living Types ---

export interface BasketItem {
  item: string;
  israelILS: number;
  germanyILS: number;
  usaILS: number;
}

export interface CostOfLivingData {
  foodPriceIndexVsEU: {
    israel: number;
    euAverage: number;
  };
  carImportTax: {
    effectiveTotal: number;
    purchaseTax: number;
    vat: number;
  };
  telecomDeregulation: {
    before2012MonthlyILS: number;
    after2015MonthlyILS: number;
    reductionPercent: number;
    lesson: string;
  };
  basketComparisons: BasketItem[];
  averageMonthlyRent: {
    telAviv: number;
    jerusalem: number;
    haifa: number;
  };
  sources: AnalysisSource[];
}

// --- FAQ Data Types ---

export interface FAQSubtopic {
  id: string;
  key: string;
}

export interface FAQTopic {
  id: string;
  icon: string;
  subtopics: FAQSubtopic[];
}

export interface FAQData {
  topics: FAQTopic[];
}

// --- Action Resources Types ---

export interface ActionItem {
  id: string;
  key: string;
  url?: string;
}

export interface ActionLevel {
  id: string;
  icon: string;
  actions: ActionItem[];
}

export interface ActionResourcesData {
  levels: ActionLevel[];
}

// --- Freedom Analysis Types ---

export interface ReformScenario {
  id: string;
  label: string;
  incomeTaxReductionPercent: number;
  vatReductionPercent: number;
  niReductionPercent: number;
  description: string;
}

export interface CountryCapitalGains {
  country: string;
  shortTerm: number;
  longTerm: number;
  notes: string;
}

export interface IsraelCapitalGains {
  standard: number;
  significantShareholder: number;
  realEstateAppreciation: number;
  foreignInvestments: number;
  crypto: number;
  dividends: number;
  interestIncome: number;
  notes: string;
}

export interface ComparisonMarket {
  market: string;
  listedCompanies: number;
  dailyVolumeBillionUSD: number;
}

export interface TASERestrictions {
  foreignOwnershipLimits: boolean;
  dualListingBarriers: boolean;
  regulatoryComplexity: string;
  marketCapBillionUSD: number;
  numberOfListedCompanies: number;
  averageDailyVolumeBillionUSD: number;
  comparisonMarkets: ComparisonMarket[];
}

export interface AssetTaxInfo {
  taxRate: number;
  reporting?: string;
  restrictions?: string;
  additionalTaxOnDividends?: boolean;
  currencyGainsTaxed?: boolean;
  notes?: string;
  purchaseTax?: string;
  appreciationTax?: number;
  bettermentLevy?: string;
}

export interface DeregulationItem {
  currentPremiumPercent?: number;
  estimatedReductionPercent?: number;
  currentTaxPercent?: number;
  reformedTaxPercent?: number;
  currentPriceToIncome?: number;
  targetPriceToIncome?: number;
  estimatedRentReductionPercent?: number;
  actualReductionPercent?: number;
  mechanism: string;
}

export interface EconomicPrinciple {
  id: string;
  author: string;
  principle: string;
  application: string;
}

export interface FreedomAnalysisData {
  lastUpdated: string;
  reformScenarios: Record<string, ReformScenario>;
  capitalGainsTax: {
    israel: IsraelCapitalGains;
    international: CountryCapitalGains[];
  };
  taseRestrictions: TASERestrictions;
  alternativeAssets: Record<string, AssetTaxInfo>;
  deregulationMultipliers: Record<string, DeregulationItem>;
  economicPrinciples: EconomicPrinciple[];
  sources: AnalysisSource[];
}

// --- OECD Time-Series Types ---

export interface TimeSeriesDataPoint {
  year: number;
  israel: number;
  oecdAverage: number;
}

export interface OECDTimeSeriesData {
  lastUpdated: string;
  source: string;
  sourceUrl: string;
  taxToGDP: TimeSeriesDataPoint[];
  healthSpendingPerCapita: TimeSeriesDataPoint[];
  housingPriceToIncome: TimeSeriesDataPoint[];
}
