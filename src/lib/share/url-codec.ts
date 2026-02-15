import type { EmploymentType, Gender } from '@/lib/tax-engine/types';

interface ShareableProfile {
  monthlyIncome: number;
  employmentType: EmploymentType;
  gender: Gender;
  childAges: number[];
  selectedCity: string | null;
}

/**
 * Encode calculator state into compact URL query params.
 * Format: ?i=15000&t=e&g=m&c=3,7&city=jerusalem
 */
export function encodeProfileToURL(profile: ShareableProfile): string {
  const params = new URLSearchParams();
  params.set('i', String(profile.monthlyIncome));
  params.set('t', profile.employmentType === 'employee' ? 'e' : 's');
  params.set('g', profile.gender === 'male' ? 'm' : 'f');
  if (profile.childAges.length > 0) {
    params.set('c', profile.childAges.join(','));
  }
  if (profile.selectedCity) {
    params.set('city', profile.selectedCity);
  }
  return params.toString();
}

/**
 * Decode URL query params back into calculator state.
 * Returns null if required params are missing.
 */
export function decodeProfileFromURL(
  params: URLSearchParams
): ShareableProfile | null {
  const income = params.get('i');
  if (!income) return null;

  const monthlyIncome = Number(income);
  if (isNaN(monthlyIncome) || monthlyIncome <= 0) return null;

  return {
    monthlyIncome,
    employmentType: params.get('t') === 's' ? 'selfEmployed' : 'employee',
    gender: params.get('g') === 'f' ? 'female' : 'male',
    childAges: params.get('c')
      ? params.get('c')!.split(',').map(Number).filter((n) => !isNaN(n))
      : [],
    selectedCity: params.get('city') ?? null,
  };
}

/**
 * Generate a full shareable URL for the current page.
 */
export function buildShareURL(
  profile: ShareableProfile,
  baseUrl: string
): string {
  const queryString = encodeProfileToURL(profile);
  return `${baseUrl}?${queryString}`;
}
