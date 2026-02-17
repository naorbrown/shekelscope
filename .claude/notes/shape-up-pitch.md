# Open Shekel — Shape Up Pitch

## Problem
Israeli citizens pay a significant portion of their income in taxes but have no visceral understanding of where that money goes. They feel the economic pain daily — insane rent, expensive groceries, long ER waits — but can't connect their tax contribution to these failures. Because they can't connect cause to effect, they feel powerless. "What can I even do?"

## Appetite
**Small Batch: 2-3 weeks.** Build the core narrative loop with clean, modular architecture that invites future expansion.

## Solution: The Core Loop (3 Steps)

### Step 1: Enter My Salary
- Simple input: monthly salary, employee/self-employed
- Output: total tax amount, effective rate — no jargon, no clutter

### Step 2: See Where My Money Goes and Why It's Failing Me
- Each budget category pairs YOUR personal contribution with the real-world pain you feel
- Example: "₪1,200/mo → Housing & Land Policy. You pay this. Home prices rose 150% in 15 years. Here's why."
- Backed by validated data from gov.il, OECD, World Bank, CBS (Central Bureau of Statistics)
- Not all 13 categories — focus on the ones that hurt most: housing, healthcare, education, cost of living, transportation

### Step 3: Act On It
Two types of actions per issue:

**Route around the system:**
- Homeschooling alternatives to broken public education
- Private/community healthcare options
- Housing co-ops, alternative ownership models
- Local food co-ops, direct sourcing

**Force the system to change:**
- Demand referenda on specific policies
- Organized protest guides
- Freedom of information requests to specific ministries
- Collective citizen bargaining
- Tax payment demands (legal channels for accountability)

Actions are: non-partisan, nonviolent, concrete, and structural.

## Architecture Principles (for this batch and future ones)
1. **Separation of concerns:** Tax engine, data layer, UI, and narrative content are independent modules
2. **Data layer is first-class:** Zod-validated schemas, sourced and timestamped data, automated update scripts
3. **Content is data:** Pain-point narratives and actions are structured data, not hardcoded JSX
4. **Feature-based module structure:** Group by domain (tax-engine, budget, actions), not by file type
5. **English only** for now — but no hardcoded strings (prepare for future i18n without implementing it)
6. **Test the things that matter:** Tax calculations, data validation, core user flow

## What's IN
- Salary input (employee / self-employed)
- Personalized tax total + effective rate
- Budget breakdown with pain-point narratives (top 5 categories)
- Concrete actions per category (route-around + force-change)
- Validated data layer with Zod schemas and source attribution
- Automated data update scripts (OECD, gov.il)
- Mobile-first responsive design
- Clean modular architecture
- Unit tests for tax engine + data integrity
- E2E test for core flow

## What's OUT (future cycles)
- Hebrew / i18n
- Profile save/load
- OECD comparison visualizations
- Freedom / investment analysis
- Scenario comparison
- Share card / URL sharing
- Arnona (municipal tax) calculator
- Civic action tracking / gamification
- Advanced charts (Sankey, treemap)

## Risks & Rabbit Holes

### 1. Data narrative quality (MEDIUM risk)
Writing compelling, accurate "why it's failing you" narratives for each category takes research.
**Mitigation:** Start with 5 categories. Use published data sources only. Each narrative has: one stat, one cause, one consequence. Keep it tight.

### 2. Action research (MEDIUM risk)
Finding real, actionable alternatives (not generic "get involved") requires domain knowledge.
**Mitigation:** Start with 2-3 actions per category. Prefer actions with existing organizations/platforms. Link to real resources.

### 3. Tax engine accuracy (LOW risk)
The existing tax engine is well-tested and modular. Rebuild risk is low.
**Mitigation:** Port existing engine with improved types, keep existing tests, add edge cases.

### 4. Scope creep into visualization (LOW risk)
The current app has Sankey diagrams, treemaps, donut charts. Tempting to rebuild them.
**Mitigation:** Hard boundary: no complex visualizations in small batch. Simple, clear numbers and progress bars only.

## Target User
A frustrated Israeli — salaried, feeling the squeeze, knows things are broken but can't articulate why or what to do. Not politically aligned. Wants understanding and agency, not ideology.

## Success Criteria
A user enters their salary and within 60 seconds:
1. Knows exactly how much they pay in tax
2. Sees WHERE that money goes and WHY it's not working for them
3. Has 2-3 concrete things they can do about the issue that bothers them most
4. Feels less powerless than when they started
