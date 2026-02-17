/**
 * English content map.
 * Single source of truth for all UI strings.
 * When i18n is added, this becomes the English locale file.
 */
export const en: Record<string, string> = {
  // App
  'app.title': 'Open Shekel',
  'app.description': 'See where your tax money goes, why things cost what they do, and what you can do about it.',

  // Tax type labels
  'tax.incomeTax': 'Income Tax',
  'tax.nationalInsurance': 'National Insurance',
  'tax.healthTax': 'Health Tax',
  'tax.vat': 'VAT (Value Added Tax)',
  'tax.arnona': 'Municipal Tax (Arnona)',
  'tax.employerCost': 'Total Employer Cost',
  'tax.totalDeductions': 'Total Deductions',
  'tax.netIncome': 'Net Income',
  'tax.effectiveRate': 'Effective Tax Rate',

  // Input labels
  'input.monthlyIncome': 'Monthly Gross Income (₪)',
  'input.employmentType': 'Employment Type',
  'input.gender': 'Gender',
  'input.children': 'Children',
  'input.city': 'City (for Arnona)',
  'input.calculate': 'See Where Your Money Goes',
  'input.reset': 'Reset',
  'input.addChild': 'Add child',
  'input.removeChild': 'Remove',
  'input.childAge': 'Age',
  'input.selectCity': 'Select a city…',
  'input.none': 'None',

  // Employment types
  'employment.employee': 'Employee',
  'employment.selfEmployed': 'Self-Employed',

  // Gender
  'gender.male': 'Male',
  'gender.female': 'Female',

  // Section headers
  'section.hero.title': 'Where does your money go?',
  'section.hero.subtitle': 'Enter your salary. See exactly what you pay, where it goes, why it fails you — and what you can do.',
  'section.summary.title': 'Your Monthly Tax Burden',
  'section.breakdown.title': 'Where Your ₪{amount}/month Goes',
  'section.breakdown.subtitle': 'Every shekel below is YOUR money. Tap a category to see the problems — and the actions you can take.',
  'section.actions.title': 'What You Can Actually Do',
  'section.actions.subtitle': 'You are not powerless. Start wherever feels right and escalate from there.',

  // Tax summary labels
  'summary.monthlyGross': 'Monthly Gross',
  'summary.monthlyNet': 'Monthly Net',
  'summary.totalDeductions': 'Total Deductions',
  'summary.effectiveRate': 'Effective Rate',
  'summary.dailyTax': 'Daily Tax Cost',
  'summary.perDay': '/day',

  // Budget categories
  'budget.category.defense': 'Defense',
  'budget.category.education': 'Education',
  'budget.category.welfare': 'Welfare & Social Services',
  'budget.category.health': 'Health',
  'budget.category.debt': 'Debt Service',
  'budget.category.transportation': 'Transportation',
  'budget.category.public_safety': 'Public Safety',
  'budget.category.housing': 'Housing & Construction',
  'budget.category.agriculture': 'Agriculture',
  'budget.category.immigration': 'Immigration & Absorption',
  'budget.category.culture': 'Culture & Sport',
  'budget.category.environment': 'Environmental Protection',
  'budget.category.other': 'Other',

  // Category detail labels
  'category.whatYouPay': "What you're paying for",
  'category.problems': 'The problems',
  'category.betterSystem': 'A better system exists',
  'category.ministry': 'Responsible ministry',
  'category.employees': 'employees',
  'category.avgSalary': 'avg monthly salary',
  'category.overhead': 'lost to overhead',
  'category.yourMoney': 'of your money',
  'category.sources': 'Sources',
  'category.actions': 'Take action',

  // Efficiency grades
  'grade.A': 'Excellent',
  'grade.B': 'Good',
  'grade.C': 'Fair',
  'grade.D': 'Poor',
  'grade.F': 'Failing',
  'grade.N/A': 'No Data',

  // Action levels
  'action.level.mindset': 'Change Your Mindset',
  'action.level.educate': 'Educate Others',
  'action.level.civic': 'Civic Engagement',
  'action.level.organize': 'Organize',
  'action.level.vote': 'Vote',

  // Action level descriptions
  'action.level.mindset.description': 'The system depends on your resignation. Refuse it.',
  'action.level.educate.description': "Most people don't know where their money goes. Change that.",
  'action.level.civic.description': "The tools exist. Most people just don't use them.",
  'action.level.organize.description': 'Individual action matters. Collective action changes systems.',
  'action.level.vote.description': 'Democracy only works when people show up informed.',

  // Action items
  'action.mindset.economicLiteracy': 'Learn basic economics — understand how taxes, budgets, and public spending actually work.',
  'action.mindset.personalResponsibility': 'Take ownership of your financial future instead of waiting for the system to fix itself.',
  'action.mindset.loveYourNeighbor': 'Remember that a better system benefits everyone, not just you.',
  'action.educate.shareTool': 'Share this tool with friends and family so they can see their own numbers.',
  'action.educate.discussFamily': 'Start the conversation at home — discuss taxes and spending with your family.',
  'action.educate.socialMedia': 'Share specific findings on social media with data, not just complaints.',
  'action.civic.contactMK': 'Contact your Knesset member directly about specific budget issues.',
  'action.civic.fileFOI': 'File a Freedom of Information request to get specific data from any ministry.',
  'action.civic.attendMunicipal': 'Attend your local municipal council meetings — they decide your arnona rates.',
  'action.civic.referendumProcess': 'Learn how to initiate a local referendum on specific municipal issues.',
  'action.organize.joinCitizenGroups': 'Join existing citizen watchdog groups that monitor government spending.',
  'action.organize.supportReformOrgs': 'Support the Israel Democracy Institute — research-based reform advocacy.',
  'action.organize.supportKohelet': 'Support the Kohelet Policy Forum — free-market economic policy research.',
  'action.organize.supportTaub': 'Support the Taub Center — independent socioeconomic research.',
  'action.vote.checkRegistration': 'Verify your voter registration is current before any election.',
  'action.vote.researchParties': 'Research party positions on economic reform — not just their slogans.',
  'action.vote.voterTurnout': 'Make a plan to vote and bring others — low turnout benefits the status quo.',
};
