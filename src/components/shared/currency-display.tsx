'use client';

const formatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const detailedFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number, detailed = false): string {
  return detailed ? detailedFormatter.format(amount) : formatter.format(amount);
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
