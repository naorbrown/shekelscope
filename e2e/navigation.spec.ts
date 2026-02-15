import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('navigates to all main pages', async ({ page }) => {
    await page.goto('/');

    // Dashboard
    await page.getByRole('link', { name: /dashboard/i }).click();
    await expect(page).toHaveURL(/dashboard/);

    // Insights
    await page.getByRole('link', { name: /real cost/i }).click();
    await expect(page).toHaveURL(/insights/);

    // Why
    await page.getByRole('link', { name: /why/i }).click();
    await expect(page).toHaveURL(/why/);

    // Action
    await page.getByRole('link', { name: /action/i }).click();
    await expect(page).toHaveURL(/action/);

    // Calculator (home)
    await page.getByRole('link', { name: /calculator/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('language toggle switches to Hebrew', async ({ page }) => {
    await page.goto('/');

    // Find and click language toggle
    const langButton = page.getByRole('button', { name: /language|שפה/i });
    if (await langButton.isVisible()) {
      await langButton.click();
    }

    // Should navigate to Hebrew version
    await page.waitForURL(/\/he/);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'he');
  });

  test('mobile menu works on small viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobile hamburger menu should be visible
    const menuButton = page.getByRole('button', { name: /menu|open/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Nav links should appear in the sheet
      await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
    }
  });
});
