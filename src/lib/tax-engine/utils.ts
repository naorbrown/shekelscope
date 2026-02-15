export function roundToAgora(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function annualToMonthly(annual: number): number {
  return roundToAgora(annual / 12);
}

export function monthlyToAnnual(monthly: number): number {
  return roundToAgora(monthly * 12);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
