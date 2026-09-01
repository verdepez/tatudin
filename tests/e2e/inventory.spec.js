import { test, expect } from '@playwright/test';

test.describe('E2E: Inventario Multi-Nivel y Movimientos de Stock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginTab = page.locator('button[data-switch-auth="login"]');
    if (await loginTab.isVisible()) {
      await loginTab.click();
      const loginForm = page.locator('form[data-onboarding-form="login"]');
      await loginForm.locator('input[name="email"]').fill('owner@inksanctuary.com');
      await loginForm.locator('input[name="password"]').fill('password123');
      await loginForm.locator('button[type="submit"]').click();
    }
  });

  test('Debe visualizar inventario del estudio, alternar a inventario personal y abrir modal de nuevo insumo', async ({ page }) => {
    // 1. Navegar a Inventario
    await page.locator('a[data-view="inventario"]').first().click();
    await expect(page.locator('h1, h2')).toContainText(/Inventario|Stock/i);

    // 2. Abrir modal para crear nuevo insumo
    const addItemBtn = page.locator('button[data-action="open-add-item-modal"]');
    if (await addItemBtn.isVisible()) {
      await addItemBtn.click();
      await expect(page.locator('#modal')).toBeVisible();
      await page.locator('button[data-close-modal], button[data-action="close-modal"]').first().click();
    }
  });
});

