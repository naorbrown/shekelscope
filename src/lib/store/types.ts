import type { EmploymentType, Gender } from '@/lib/tax-engine/types';

export interface TaxProfile {
  id: string;
  name: string;
  monthlyIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  childAges: number[];
  selectedCity: string | null;
  createdAt: number;
}

export interface CompletedAction {
  actionId: string;
  completedAt: number;
}

export interface CivicReminder {
  id: string;
  title: string;
  date: number;
  actionId?: string;
  notified: boolean;
}
