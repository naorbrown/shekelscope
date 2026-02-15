import { test, expect } from '@playwright/test';

test.describe('Why So Expensive Page', () => {
  test('renders page title and accordion sections', async ({ page }) => {
    await page.goto('/en/why');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /why so expensive/i })).toBeVisible();
    // Check that accordion triggers are rendered (using the topic titles from translations)
    await expect(page.getByText(/the housing crisis/i)).toBeVisible();
  });

  test('shows new economic topics', async ({ page }) => {
    await page.goto('/en/why');
    await page.waitForLoadState('networkidle');
    // New topics added in content expansion
    await expect(page.getByText(/inflation tax/i)).toBeVisible();
    await expect(page.getByText(/tycoon problem/i)).toBeVisible();
    await expect(page.getByText(/high-tech salaries/i)).toBeVisible();
    await expect(page.getByText(/don.*need government/i)).toBeVisible();
  });

  test('expands accordion to show content', async ({ page }) => {
    await page.goto('/en/why');
    await page.waitForLoadState('networkidle');
    const trigger = page.getByText(/the housing crisis/i);
    await trigger.click();
    await page.waitForTimeout(300);
    await expect(page.getByText(/93%/).first()).toBeVisible();
  });

  test('shows source links in expanded accordion', async ({ page }) => {
    await page.goto('/en/why');
    await page.waitForLoadState('networkidle');
    await page.getByText(/the housing crisis/i).click();
    await page.waitForTimeout(300);
    const links = page.locator('a[target="_blank"]');
    expect(await links.count()).toBeGreaterThan(0);
  });
});

test.describe('Take Action Page', () => {
  test('renders all 5 action levels', async ({ page }) => {
    await page.goto('/en/action');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/shift your perspective/i)).toBeVisible();
    await expect(page.getByText(/spread awareness/i)).toBeVisible();
    await expect(page.getByText(/engage the system/i)).toBeVisible();
    await expect(page.getByText(/organize/i)).toBeVisible();
    await expect(page.getByText(/vote with purpose/i)).toBeVisible();
  });

  test('shows external links for civic engagement', async ({ page }) => {
    await page.goto('/en/action');
    await page.waitForLoadState('networkidle');
    const knessetLink = page.locator('a[href*="knesset"]');
    expect(await knessetLink.count()).toBeGreaterThan(0);
  });
});

test.describe('Insights Page', () => {
  test('shows title when no data available', async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/en/insights');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /the real cost/i })).toBeVisible();
  });
});
