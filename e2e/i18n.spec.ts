import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('Hebrew page renders with RTL', async ({ page }) => {
    await page.goto('/he');
    await page.waitForLoadState('networkidle');
    // Check for Hebrew content (nav items are translated)
    await expect(page.getByText(/מחשבון/).first()).toBeVisible();
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
  });

  test('Hebrew why page renders Hebrew titles', async ({ page }) => {
    await page.goto('/he/why');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: /למה הכל כל כך יקר/ })).toBeVisible();
  });

  test('English page renders correctly', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });
});
