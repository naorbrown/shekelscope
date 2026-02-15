import type { EmploymentType, NationalInsuranceData, NationalInsuranceResult } from './types';
import { roundToAgora } from './utils';

export function calculateNationalInsurance(
  annualGrossIncome: number,
  employmentType: EmploymentType,
  rates: NationalInsuranceData
): NationalInsuranceResult {
  if (annualGrossIncome <= 0) {
    return {
      employeeContribution: 0,
      employerContribution: 0,
      reducedPortionEmployee: 0,
      fullPortionEmployee: 0,
      effectiveRate: 0,
    };
  }

  const threshold = rates.reducedRateThreshold.annual;
  const ceiling = rates.maxInsurableIncome.annual;
  const insurable = Math.min(annualGrossIncome, ceiling);

  if (employmentType === 'employee') {
    const reducedRate = rates.employee.reduced.nationalInsurance;
    const fullRate = rates.employee.full.nationalInsurance;
    const employerReducedRate = rates.employer.reduced.nationalInsurance;
    const employerFullRate = rates.employer.full.nationalInsurance;

    const reducedPortion = Math.min(insurable, threshold);
    const fullPortion = Math.max(0, insurable - threshold);

    const employeeContribution = roundToAgora(
      reducedPortion * reducedRate + fullPortion * fullRate
    );
    const employerContribution = roundToAgora(
      reducedPortion * employerReducedRate + fullPortion * employerFullRate
    );

    return {
      employeeContribution,
      employerContribution,
      reducedPortionEmployee: roundToAgora(reducedPortion * reducedRate),
      fullPortionEmployee: roundToAgora(fullPortion * fullRate),
      effectiveRate: annualGrossIncome > 0 ? employeeContribution / annualGrossIncome : 0,
    };
  }

  // Self-employed
  const exemption = rates.selfEmployed.exemptionThreshold.annual;
  const reducedRate = rates.selfEmployed.reduced.nationalInsurance;
  const fullRate = rates.selfEmployed.full.nationalInsurance;

  const afterExemption = Math.max(0, insurable - exemption);
  const reducedPortion = Math.min(afterExemption, Math.max(0, threshold - exemption));
  const fullPortion = Math.max(0, afterExemption - reducedPortion);

  const contribution = roundToAgora(
    reducedPortion * reducedRate + fullPortion * fullRate
  );

  return {
    employeeContribution: contribution,
    employerContribution: 0,
    reducedPortionEmployee: roundToAgora(reducedPortion * reducedRate),
    fullPortionEmployee: roundToAgora(fullPortion * fullRate),
    effectiveRate: annualGrossIncome > 0 ? contribution / annualGrossIncome : 0,
  };
}
