/**
 * Typed content key constants.
 * Every user-facing string is accessed through these keys.
 * When i18n is implemented, these become the lookup keys for translations.
 */
export const CONTENT = {
  // App
  APP_TITLE: 'app.title',
  APP_DESCRIPTION: 'app.description',

  // Tax type labels
  TAX_INCOME_TAX: 'tax.incomeTax',
  TAX_NATIONAL_INSURANCE: 'tax.nationalInsurance',
  TAX_HEALTH_TAX: 'tax.healthTax',
  TAX_VAT: 'tax.vat',
  TAX_ARNONA: 'tax.arnona',
  TAX_EMPLOYER_COST: 'tax.employerCost',
  TAX_TOTAL_DEDUCTIONS: 'tax.totalDeductions',
  TAX_NET_INCOME: 'tax.netIncome',
  TAX_EFFECTIVE_RATE: 'tax.effectiveRate',

  // Input labels
  INPUT_MONTHLY_INCOME: 'input.monthlyIncome',
  INPUT_EMPLOYMENT_TYPE: 'input.employmentType',
  INPUT_GENDER: 'input.gender',
  INPUT_CHILDREN: 'input.children',
  INPUT_CITY: 'input.city',
  INPUT_CALCULATE: 'input.calculate',
  INPUT_RESET: 'input.reset',
  INPUT_ADD_CHILD: 'input.addChild',
  INPUT_REMOVE_CHILD: 'input.removeChild',
  INPUT_CHILD_AGE: 'input.childAge',
  INPUT_SELECT_CITY: 'input.selectCity',
  INPUT_NONE: 'input.none',

  // Employment types
  EMPLOYMENT_EMPLOYEE: 'employment.employee',
  EMPLOYMENT_SELF_EMPLOYED: 'employment.selfEmployed',

  // Gender
  GENDER_MALE: 'gender.male',
  GENDER_FEMALE: 'gender.female',

  // Section headers
  SECTION_HERO_TITLE: 'section.hero.title',
  SECTION_HERO_SUBTITLE: 'section.hero.subtitle',
  SECTION_SUMMARY_TITLE: 'section.summary.title',
  SECTION_BREAKDOWN_TITLE: 'section.breakdown.title',
  SECTION_BREAKDOWN_SUBTITLE: 'section.breakdown.subtitle',
  SECTION_ACTIONS_TITLE: 'section.actions.title',
  SECTION_ACTIONS_SUBTITLE: 'section.actions.subtitle',

  // Tax summary
  SUMMARY_MONTHLY_GROSS: 'summary.monthlyGross',
  SUMMARY_MONTHLY_NET: 'summary.monthlyNet',
  SUMMARY_TOTAL_DEDUCTIONS: 'summary.totalDeductions',
  SUMMARY_EFFECTIVE_RATE: 'summary.effectiveRate',
  SUMMARY_DAILY_TAX: 'summary.dailyTax',
  SUMMARY_PER_DAY: 'summary.perDay',

  // Budget categories (keyed by ID for dynamic lookup)
  budgetCategory: (id: string) => `budget.category.${id}`,

  // Category detail labels
  CATEGORY_WHAT_YOU_PAY: 'category.whatYouPay',
  CATEGORY_PROBLEMS: 'category.problems',
  CATEGORY_BETTER_SYSTEM: 'category.betterSystem',
  CATEGORY_MINISTRY: 'category.ministry',
  CATEGORY_EMPLOYEES: 'category.employees',
  CATEGORY_AVG_SALARY: 'category.avgSalary',
  CATEGORY_OVERHEAD: 'category.overhead',
  CATEGORY_YOUR_MONEY: 'category.yourMoney',
  CATEGORY_SOURCES: 'category.sources',
  CATEGORY_ACTIONS: 'category.actions',

  // Efficiency grades
  grade: (grade: string) => `grade.${grade}`,

  // Action levels
  actionLevel: (id: string) => `action.level.${id}`,
  actionLevelDescription: (id: string) => `action.level.${id}.description`,
  actionItem: (key: string) => `action.${key}`,
} as const;
