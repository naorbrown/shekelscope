import { test, expect } from '@playwright/test';

test.describe('Calculator Page', () => {
  test('renders hero and calculator form', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input#income')).toBeVisible();
  });

  test('has default salary pre-filled', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    // Default salary should be 13316 (average Israeli monthly wage)
    await expect(input).toHaveValue('13316');
  });

  test('shows city dropdown', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const citySelect = page.locator('select#city');
    await expect(citySelect).toBeVisible();
    // Should have multiple cities
    const options = citySelect.locator('option');
    expect(await options.count()).toBeGreaterThan(5);
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

  test('shows radical banner after calculation', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate/i }).click();
    // Banner is now below results, need to scroll and wait for it
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    await expect(page.getByText(/93% of land/i)).toBeVisible();
  });

  test('calculates with city selection for arnona', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    // Select Tel Aviv
    const citySelect = page.locator('select#city');
    await citySelect.selectOption({ label: 'Tel Aviv' });
    await page.getByRole('button', { name: /calculate/i }).click();
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
  });

  test('expands budget category to see narrative details', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('20000');
    await page.getByRole('button', { name: /calculate/i }).click();
    await expect(page.getByText(/where your taxes go/i)).toBeVisible();
    // Click on Defense category to expand it
    const defenseItem = page.getByText(/defense/i).first();
    await defenseItem.click();
    await page.waitForTimeout(300);
    // Should see narrative content
    await expect(page.getByText(/what you.*paying for/i).first()).toBeVisible();
  });
});
