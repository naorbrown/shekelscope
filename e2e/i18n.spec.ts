import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('Hebrew page renders with RTL', async ({ page }) => {
    await page.goto('/he');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'he');
    // Check for Hebrew content
    await expect(page.getByText(/מחשבון/)).toBeVisible();
  });

  test('Hebrew why page renders Hebrew titles', async ({ page }) => {
    await page.goto('/he/why');
    await expect(page.getByText(/למה הכל כל כך יקר/)).toBeVisible();
    await expect(page.getByText(/משבר הדיור/)).toBeVisible();
  });

  test('English page has LTR direction', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    await expect(html).toHaveAttribute('lang', 'en');
  });
});
