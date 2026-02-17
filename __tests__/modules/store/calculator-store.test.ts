import { describe, it, expect, beforeEach } from 'vitest';
import { useCalculatorStore } from '@/modules/store/calculator-store';

describe('useCalculatorStore', () => {
  beforeEach(() => {
    useCalculatorStore.getState().reset();
  });

  it('has correct initial state', () => {
    const state = useCalculatorStore.getState();
    expect(state.inputs.monthlyIncome).toBe(13316);
    expect(state.inputs.employmentType).toBe('employee');
    expect(state.inputs.gender).toBe('male');
    expect(state.inputs.childAges).toEqual([]);
    expect(state.inputs.selectedCity).toBeNull();
    expect(state.result).toBeNull();
    expect(state.hasCalculated).toBe(false);
  });

  it('updates monthly income', () => {
    useCalculatorStore.getState().setMonthlyIncome(20000);
    expect(useCalculatorStore.getState().inputs.monthlyIncome).toBe(20000);
  });

  it('updates employment type', () => {
    useCalculatorStore.getState().setEmploymentType('selfEmployed');
    expect(useCalculatorStore.getState().inputs.employmentType).toBe('selfEmployed');
  });

  it('updates gender', () => {
    useCalculatorStore.getState().setGender('female');
    expect(useCalculatorStore.getState().inputs.gender).toBe('female');
  });

  it('adds and removes children', () => {
    const store = useCalculatorStore.getState();
    store.addChild();
    expect(useCalculatorStore.getState().inputs.childAges).toEqual([0]);

    useCalculatorStore.getState().addChild();
    expect(useCalculatorStore.getState().inputs.childAges).toEqual([0, 0]);

    useCalculatorStore.getState().setChildAge(0, 5);
    expect(useCalculatorStore.getState().inputs.childAges).toEqual([5, 0]);

    useCalculatorStore.getState().removeChild(1);
    expect(useCalculatorStore.getState().inputs.childAges).toEqual([5]);
  });

  it('updates selected city', () => {
    useCalculatorStore.getState().setSelectedCity('tel_aviv');
    expect(useCalculatorStore.getState().inputs.selectedCity).toBe('tel_aviv');
  });

  it('calculates and produces a valid result', () => {
    useCalculatorStore.getState().calculate();
    const state = useCalculatorStore.getState();

    expect(state.hasCalculated).toBe(true);
    expect(state.result).not.toBeNull();
    expect(state.result!.grossIncome).toBe(13316 * 12);
    expect(state.result!.totalDeductions).toBeGreaterThan(0);
    expect(state.result!.netIncome).toBeLessThan(state.result!.grossIncome);
    expect(state.result!.budgetAllocation.length).toBeGreaterThan(0);
  });

  it('does not calculate for zero income', () => {
    useCalculatorStore.getState().setMonthlyIncome(0);
    useCalculatorStore.getState().calculate();
    expect(useCalculatorStore.getState().result).toBeNull();
    expect(useCalculatorStore.getState().hasCalculated).toBe(false);
  });

  it('resets to defaults', () => {
    useCalculatorStore.getState().setMonthlyIncome(50000);
    useCalculatorStore.getState().calculate();
    useCalculatorStore.getState().reset();

    const state = useCalculatorStore.getState();
    expect(state.inputs.monthlyIncome).toBe(13316);
    expect(state.result).toBeNull();
    expect(state.hasCalculated).toBe(false);
  });
});
