import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test('shows no-data message when no calculation exists', async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/en/dashboard');
    await expect(page.getByText(/no income data/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /go to calculator/i })).toBeVisible();
  });

  test('shows charts after calculation', async ({ page }) => {
    await page.goto('/en');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate/i }).click();

    await page.goto('/en/dashboard');
    await expect(page.getByText(/tax dashboard/i)).toBeVisible();
    await expect(page.getByText(/how israel compares/i)).toBeVisible();
  });
});
