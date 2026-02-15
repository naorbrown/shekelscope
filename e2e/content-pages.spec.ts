import { test, expect } from '@playwright/test';

test.describe('Why So Expensive Page', () => {
  test('renders all 7 accordion sections', async ({ page }) => {
    await page.goto('/why');
    await expect(page.getByText(/housing crisis/i)).toBeVisible();
    await expect(page.getByText(/everything costs more/i)).toBeVisible();
    await expect(page.getByText(/healthcare/i)).toBeVisible();
    await expect(page.getByText(/paying more/i)).toBeVisible();
    await expect(page.getByText(/olim leave/i)).toBeVisible();
    await expect(page.getByText(/price-salary/i)).toBeVisible();
    await expect(page.getByText(/butterfly effect/i)).toBeVisible();
  });

  test('expands accordion to show content', async ({ page }) => {
    await page.goto('/why');
    await page.getByText(/housing crisis/i).click();
    await expect(page.getByText(/93% of land/i)).toBeVisible();
    await expect(page.getByText(/root cause/i)).toBeVisible();
    await expect(page.getByText(/alternative/i)).toBeVisible();
  });

  test('shows source links in expanded accordion', async ({ page }) => {
    await page.goto('/why');
    await page.getByText(/housing crisis/i).click();
    await expect(page.getByText(/sources/i)).toBeVisible();
    // Should have external links
    const links = page.locator('a[target="_blank"]');
    expect(await links.count()).toBeGreaterThan(0);
  });
});

test.describe('Take Action Page', () => {
  test('renders all 5 action levels', async ({ page }) => {
    await page.goto('/action');
    await expect(page.getByText(/shift your perspective/i)).toBeVisible();
    await expect(page.getByText(/spread awareness/i)).toBeVisible();
    await expect(page.getByText(/engage the system/i)).toBeVisible();
    await expect(page.getByText(/organize/i)).toBeVisible();
    await expect(page.getByText(/vote with purpose/i)).toBeVisible();
  });

  test('shows external links for civic engagement', async ({ page }) => {
    await page.goto('/action');
    // Should have links to Knesset and FOI
    const knessetLink = page.locator('a[href*="knesset"]');
    expect(await knessetLink.count()).toBeGreaterThan(0);
  });
});

test.describe('Insights Page', () => {
  test('prompts to go to calculator when no data', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/insights');
    await expect(page.getByText(/real cost/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /calculator/i })).toBeVisible();
  });
});
