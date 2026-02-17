import type { EmploymentType, Gender, TotalTaxResult } from '../tax-engine/types';

export interface CalculatorInputs {
  monthlyIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  childAges: number[];
  selectedCity: string | null;
}

export interface CalculatorState {
  /** Persisted user inputs */
  inputs: CalculatorInputs;

  /** Computed result (not persisted — recomputed on demand) */
  result: TotalTaxResult | null;
  hasCalculated: boolean;

  /** Actions */
  setMonthlyIncome: (income: number) => void;
  setEmploymentType: (type: EmploymentType) => void;
  setGender: (gender: Gender) => void;
  addChild: () => void;
  removeChild: (index: number) => void;
  setChildAge: (index: number, age: number) => void;
  setSelectedCity: (city: string | null) => void;
  calculate: () => void;
  reset: () => void;
}
