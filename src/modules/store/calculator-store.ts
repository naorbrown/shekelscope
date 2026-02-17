import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalculatorState, CalculatorInputs } from './types';
import { calculateTotalTax } from '../tax-engine/total';
import { loadTaxData } from '../data/loader';
import { DEFAULT_MONTHLY_INCOME, TAX_YEAR } from '@/lib/constants';

const DEFAULT_INPUTS: CalculatorInputs = {
  monthlyIncome: DEFAULT_MONTHLY_INCOME,
  employmentType: 'employee',
  gender: 'male',
  childAges: [],
  selectedCity: null,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      inputs: { ...DEFAULT_INPUTS },
      result: null,
      hasCalculated: false,

      setMonthlyIncome: (income) =>
        set((s) => ({ inputs: { ...s.inputs, monthlyIncome: income } })),

      setEmploymentType: (type) =>
        set((s) => ({ inputs: { ...s.inputs, employmentType: type } })),

      setGender: (gender) =>
        set((s) => ({ inputs: { ...s.inputs, gender } })),

      addChild: () =>
        set((s) => ({ inputs: { ...s.inputs, childAges: [...s.inputs.childAges, 0] } })),

      removeChild: (index) =>
        set((s) => ({
          inputs: {
            ...s.inputs,
            childAges: s.inputs.childAges.filter((_, i) => i !== index),
          },
        })),

      setChildAge: (index, age) =>
        set((s) => ({
          inputs: {
            ...s.inputs,
            childAges: s.inputs.childAges.map((a, i) => (i === index ? age : a)),
          },
        })),

      setSelectedCity: (city) =>
        set((s) => ({ inputs: { ...s.inputs, selectedCity: city } })),

      calculate: () => {
        const { inputs } = get();
        if (inputs.monthlyIncome <= 0) return;

        const data = loadTaxData(TAX_YEAR);
        const result = calculateTotalTax(
          {
            annualGrossIncome: inputs.monthlyIncome * 12,
            employmentType: inputs.employmentType,
            gender: inputs.gender,
            taxYear: TAX_YEAR,
            childAges: inputs.childAges.length > 0 ? inputs.childAges : undefined,
            cityId: inputs.selectedCity ?? undefined,
          },
          data
        );
        set({ result, hasCalculated: true });
      },

      reset: () =>
        set({ inputs: { ...DEFAULT_INPUTS }, result: null, hasCalculated: false }),
    }),
    {
      name: 'openshekel-v2',
      version: 1,
      partialize: (state) => ({ inputs: state.inputs }),
    }
  )
);
