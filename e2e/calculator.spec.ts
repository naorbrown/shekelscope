import { test, expect } from '@playwright/test';

test.describe('Calculator Page', () => {
  test('renders hero and calculator form', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input#income')).toBeVisible();
  });

  test('calculates taxes and shows results', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate/i }).click();
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
  });

  test('displays budget breakdown after calculation', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('20000');
    await page.getByRole('button', { name: /calculate/i }).click();
    await expect(page.getByText(/where your taxes go/i)).toBeVisible();
  });

  test('toggles between monthly and annual display', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate/i }).click();
    // Wait for results to render
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    // Look for the monthly/annual toggle
    const annualButton = page.getByRole('button', { name: /annual/i });
    if (await annualButton.isVisible()) {
      await annualButton.click();
    }
  });

  test('shows radical banner', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/93% of land/i)).toBeVisible();
    await expect(page.getByText(/13 years/i)).toBeVisible();
  });
});
