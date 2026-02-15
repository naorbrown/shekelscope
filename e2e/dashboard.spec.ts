import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('shows no-data message when no calculation exists', async ({ page }) => {
    // Clear any stored data
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/dashboard');
    await expect(page.getByText(/no income data/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /go to calculator/i })).toBeVisible();
  });

  test('shows charts after calculation', async ({ page }) => {
    // First calculate
    await page.goto('/');
    const input = page.getByRole('textbox');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate/i }).click();

    // Then navigate to dashboard
    await page.goto('/dashboard');
    // Should show dashboard title
    await expect(page.getByText(/tax dashboard/i)).toBeVisible();
    // OECD comparison should be present
    await expect(page.getByText(/how israel compares/i)).toBeVisible();
  });
});
