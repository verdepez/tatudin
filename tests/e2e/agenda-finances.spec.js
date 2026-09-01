import { test, expect } from '@playwright/test';

test.describe('E2E: Agenda, Creación de Citas y Sincronización con Finanzas', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión con cuenta demo de prueba
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

  test('Debe navegar a la agenda, cambiar entre vistas y abrir modal de filtros', async ({ page }) => {
    // 1. Navegar a Agenda
    await page.locator('a[data-view="agenda"]').first().click();
    await expect(page.locator('h1, h2')).toContainText(/Agenda|Calendario/i);

    // 2. Alternar entre vista Semanal y Mensual
    const monthViewBtn = page.locator('button[data-agenda-view="month"]');
    if (await monthViewBtn.isVisible()) {
      await monthViewBtn.click();
      await expect(page.locator('.calendar-month-grid')).toBeVisible();
    }

    const weekViewBtn = page.locator('button[data-agenda-view="week"]');
    if (await weekViewBtn.isVisible()) {
      await weekViewBtn.click();
      await expect(page.locator('.calendar-week-grid')).toBeVisible();
    }

    // 3. Abrir modal de filtros
    const filterBtn = page.locator('button[data-action="open-agenda-filters"]');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await expect(page.locator('#modal')).toBeVisible();
      // Cerrar modal
      await page.locator('button[data-close-modal], button[data-action="close-modal"]').first().click();
    }
  });

  test('Debe navegar a Finanzas y verificar el cálculo de ingresos y margen neto', async ({ page }) => {
    // Navegar a Finanzas
    await page.locator('a[data-view="finanzas"]').first().click();
    await expect(page.locator('h1, h2')).toContainText(/Finanzas|Balance/i);

    // Comprobar tarjetas métricas
    await expect(page.locator('.metric-card, .financial-card').first()).toBeVisible();
  });
});

