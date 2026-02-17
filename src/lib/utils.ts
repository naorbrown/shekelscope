import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const shekelFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format a number as ₪X,XXX */
export function formatShekel(amount: number): string {
  return shekelFormatter.format(Math.round(amount));
}

const percentFormatter = new Intl.NumberFormat('en', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Format a decimal (0.35) as "35.0%" */
export function formatPercent(decimal: number): string {
  return percentFormatter.format(decimal);
}
