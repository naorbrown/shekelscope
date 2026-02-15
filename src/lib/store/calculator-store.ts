'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaxpayerProfile, TotalTaxResult, EmploymentType, Gender } from '@/lib/tax-engine/types';
import { calculateTotalTax } from '@/lib/tax-engine/total';

interface CalculatorState {
  monthlyIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  childAges: number[];
  selectedCity: string | null;
  displayMode: 'monthly' | 'annual';
  result: TotalTaxResult | null;
  hasCalculated: boolean;

  setMonthlyIncome: (income: number) => void;
  setEmploymentType: (type: EmploymentType) => void;
  setGender: (gender: Gender) => void;
  addChild: () => void;
  removeChild: (index: number) => void;
  setChildAge: (index: number, age: number) => void;
  setSelectedCity: (city: string | null) => void;
  setDisplayMode: (mode: 'monthly' | 'annual') => void;
  calculate: () => void;
  reset: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      monthlyIncome: 13316,
      employmentType: 'employee',
      gender: 'male',
      childAges: [],
      selectedCity: null,
      displayMode: 'monthly',
      result: null,
      hasCalculated: false,

      setMonthlyIncome: (income) => set({ monthlyIncome: income }),
      setEmploymentType: (type) => set({ employmentType: type }),
      setGender: (gender) => set({ gender }),
      addChild: () => set((s) => ({ childAges: [...s.childAges, 0] })),
      removeChild: (index) =>
        set((s) => ({ childAges: s.childAges.filter((_, i) => i !== index) })),
      setChildAge: (index, age) =>
        set((s) => ({
          childAges: s.childAges.map((a, i) => (i === index ? age : a)),
        })),
      setSelectedCity: (city) => set({ selectedCity: city }),
      setDisplayMode: (mode) => set({ displayMode: mode }),

      calculate: () => {
        const state = get();
        if (state.monthlyIncome <= 0) return;

        const profile: TaxpayerProfile = {
          annualGrossIncome: state.monthlyIncome * 12,
          employmentType: state.employmentType,
          gender: state.gender,
          taxYear: 2025,
          childAges: state.childAges.length > 0 ? state.childAges : undefined,
          cityId: state.selectedCity ?? undefined,
        };

        const result = calculateTotalTax(profile);
        set({ result, hasCalculated: true });
      },

      reset: () =>
        set({
          monthlyIncome: 13316,
          employmentType: 'employee',
          gender: 'male',
          childAges: [],
          selectedCity: null,
          result: null,
          hasCalculated: false,
        }),
    }),
    {
      name: 'openshekel-calculator',
      partialize: (state) => ({
        monthlyIncome: state.monthlyIncome,
        employmentType: state.employmentType,
        gender: state.gender,
        childAges: state.childAges,
        selectedCity: state.selectedCity,
        displayMode: state.displayMode,
        result: state.result,
        hasCalculated: state.hasCalculated,
      }),
    }
  )
);
