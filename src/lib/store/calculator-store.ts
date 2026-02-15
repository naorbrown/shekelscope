'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaxpayerProfile, TotalTaxResult, EmploymentType, Gender } from '@/lib/tax-engine/types';
import { calculateTotalTax } from '@/lib/tax-engine/total';
import { DEFAULT_MONTHLY_INCOME } from '@/lib/constants';
import type { TaxProfile, CompletedAction, CivicReminder } from './types';

const MAX_PROFILES = 5;

interface CalculatorState {
  // === v0 fields (unchanged) ===
  monthlyIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  childAges: number[];
  selectedCity: string | null;
  displayMode: 'monthly' | 'annual';
  result: TotalTaxResult | null;
  hasCalculated: boolean;

  // === v1 fields (profiles, actions, reminders) ===
  profiles: TaxProfile[];
  activeProfileId: string | null;
  completedActions: CompletedAction[];
  reminders: CivicReminder[];

  // === v0 actions ===
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

  // === v1 actions (profiles) ===
  saveProfile: (name: string) => void;
  loadProfile: (id: string) => void;
  deleteProfile: (id: string) => void;

  // === v1 actions (civic tracking) ===
  toggleAction: (actionId: string) => void;
  addReminder: (reminder: Omit<CivicReminder, 'id' | 'notified'>) => void;
  dismissReminder: (id: string) => void;

  // === v1 actions (sharing) ===
  hydrateFromShare: (data: {
    monthlyIncome: number;
    employmentType: EmploymentType;
    gender: Gender;
    childAges: number[];
    selectedCity: string | null;
  }) => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      // === v0 defaults ===
      monthlyIncome: DEFAULT_MONTHLY_INCOME,
      employmentType: 'employee',
      gender: 'male',
      childAges: [],
      selectedCity: null,
      displayMode: 'monthly',
      result: null,
      hasCalculated: false,

      // === v1 defaults ===
      profiles: [],
      activeProfileId: null,
      completedActions: [],
      reminders: [],

      // === v0 setters ===
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
          monthlyIncome: DEFAULT_MONTHLY_INCOME,
          employmentType: 'employee',
          gender: 'male',
          childAges: [],
          selectedCity: null,
          result: null,
          hasCalculated: false,
        }),

      // === v1: Profile management ===
      saveProfile: (name) => {
        const state = get();
        if (state.profiles.length >= MAX_PROFILES) return;

        const profile: TaxProfile = {
          id: crypto.randomUUID(),
          name,
          monthlyIncome: state.monthlyIncome,
          employmentType: state.employmentType,
          gender: state.gender,
          childAges: [...state.childAges],
          selectedCity: state.selectedCity,
          createdAt: Date.now(),
        };

        set({
          profiles: [...state.profiles, profile],
          activeProfileId: profile.id,
        });
      },

      loadProfile: (id) => {
        const state = get();
        const profile = state.profiles.find((p) => p.id === id);
        if (!profile) return;

        set({
          monthlyIncome: profile.monthlyIncome,
          employmentType: profile.employmentType,
          gender: profile.gender,
          childAges: [...profile.childAges],
          selectedCity: profile.selectedCity,
          activeProfileId: id,
          result: null,
          hasCalculated: false,
        });
      },

      deleteProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
          activeProfileId: s.activeProfileId === id ? null : s.activeProfileId,
        })),

      // === v1: Civic action tracking ===
      toggleAction: (actionId) =>
        set((s) => {
          const existing = s.completedActions.find((a) => a.actionId === actionId);
          if (existing) {
            return {
              completedActions: s.completedActions.filter(
                (a) => a.actionId !== actionId
              ),
            };
          }
          return {
            completedActions: [
              ...s.completedActions,
              { actionId, completedAt: Date.now() },
            ],
          };
        }),

      addReminder: (reminder) =>
        set((s) => ({
          reminders: [
            ...s.reminders,
            { ...reminder, id: crypto.randomUUID(), notified: false },
          ],
        })),

      dismissReminder: (id) =>
        set((s) => ({
          reminders: s.reminders.map((r) =>
            r.id === id ? { ...r, notified: true } : r
          ),
        })),

      // === v1: Share hydration ===
      hydrateFromShare: (data) => {
        set({
          monthlyIncome: data.monthlyIncome,
          employmentType: data.employmentType,
          gender: data.gender,
          childAges: data.childAges,
          selectedCity: data.selectedCity,
          result: null,
          hasCalculated: false,
        });
      },
    }),
    {
      name: 'openshekel-calculator',
      version: 1,
      migrate: (persistedState: unknown, version: number): CalculatorState => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0) {
          // v0 → v1: add new fields, keep everything else unchanged
          return {
            ...state,
            profiles: [],
            activeProfileId: null,
            completedActions: [],
            reminders: [],
          } as unknown as CalculatorState;
        }
        return state as unknown as CalculatorState;
      },
      partialize: (state) => ({
        // v0 fields
        monthlyIncome: state.monthlyIncome,
        employmentType: state.employmentType,
        gender: state.gender,
        childAges: state.childAges,
        selectedCity: state.selectedCity,
        displayMode: state.displayMode,
        result: state.result,
        hasCalculated: state.hasCalculated,
        // v1 fields
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        completedActions: state.completedActions,
        reminders: state.reminders,
      }),
    }
  )
);
