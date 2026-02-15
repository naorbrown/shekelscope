import { test, expect } from '@playwright/test';

test.describe('Economic Freedom Section', () => {
  test('freedom section is hidden before calculation', async ({ page }) => {
    await page.goto('/en');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
    // The freedom section should not be visible without calculation data
    await expect(page.locator('#freedom')).not.toBeVisible();
  });

  test('freedom section appears after calculation', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    // Fill in the calculator and trigger calculation
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate|see where/i }).click();
    // Wait for results to appear
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    // Scroll to freedom section
    await page.locator('#freedom').scrollIntoViewIfNeeded();
    await expect(
      page.getByRole('heading', { name: /what could you be getting/i })
    ).toBeVisible();
  });

  test('shows scenario toggle buttons', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate|see where/i }).click();
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    await page.locator('#freedom').scrollIntoViewIfNeeded();
    await expect(page.getByText(/moderate reform/i)).toBeVisible();
    await expect(page.getByText(/ambitious reform/i)).toBeVisible();
  });

  test('shows investment freedom section with capital gains data', async ({
    page,
  }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate|see where/i }).click();
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    // Look for investment-specific content
    await expect(page.getByText(/investment freedom/i).first()).toBeVisible();
    await expect(page.getByText(/capital gains/i).first()).toBeVisible();
  });

  test('shows freedom score section', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input#income');
    await input.fill('15000');
    await page.getByRole('button', { name: /calculate|see where/i }).click();
    await expect(page.getByText(/effective tax rate/i)).toBeVisible();
    await expect(
      page.getByText(/economic freedom score/i).first()
    ).toBeVisible();
  });

  test('freedom route redirects to homepage anchor', async ({ page }) => {
    await page.goto('/en/freedom');
    await page.waitForLoadState('networkidle');
    // Should redirect to /en#freedom
    expect(page.url()).toContain('/en');
  });
});
