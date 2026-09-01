import { test, expect } from '@playwright/test';

test.describe('E2E: Flujo de Autenticación y Onboarding', () => {
  const timestamp = Date.now();
  const testEmail = `artist_${timestamp}@tatudintest.com`;
  const testPassword = 'Password123!';
  const studioName = `Studio Eclipse ${timestamp}`;

  test('Debe cargar la PWA, mostrar splash y permitir registro completo', async ({ page }) => {
    await page.goto('/');

    // 1. Verificar carga inicial de PWA y título
    await expect(page).toHaveTitle(/Tatudin/i);

    // 2. Hacer clic en "Crear cuenta con email"
    const createAccountBtn = page.locator('button[data-onboarding-step="1"][data-auth-mode="register"]');
    if (await createAccountBtn.isVisible()) {
      await createAccountBtn.click();
    }

    // 3. Llenar formulario de registro
    const regForm = page.locator('form[data-onboarding-form="register"]');
    await expect(regForm).toBeVisible();

    await regForm.locator('input[name="fullName"]').fill('Artista Test E2E');
    await regForm.locator('input[name="email"]').fill(testEmail);
    await regForm.locator('input[name="password"]').fill(testPassword);
    await regForm.locator('button[type="submit"]').click();

    // 4. Seleccionar Rol en Onboarding (Artista Independiente)
    const independentRole = page.locator('button[data-role="independent"]');
    await expect(independentRole).toBeVisible();
    await independentRole.click();

    // 5. Paso 3: Perfil de Artista
    const profileForm = page.locator('form[data-onboarding-form="profile"]');
    await expect(profileForm).toBeVisible();
    const studioInput = profileForm.locator('input[name="studioName"]');
    if (await studioInput.isVisible()) {
      await studioInput.fill(studioName);
    }
    await profileForm.locator('button[type="submit"]').click();

    // 6. Paso 4: Fuente de Adquisición
    const sourceBtn = page.locator('button[data-source="instagram"]');
    await expect(sourceBtn).toBeVisible();
    await sourceBtn.click();

    // 7. Paso 5: Metas y Finalizar Onboarding
    const finishBtn = page.locator('button[data-finish]');
    await expect(finishBtn).toBeVisible();
    await finishBtn.click();

    // 8. Verificar acceso al Dashboard del Workspace
    const workspace = page.locator('#workspace');
    await expect(workspace).toBeVisible();
    await expect(page.locator('#view-title, h1')).toContainText(/Dashboard|Estudio/i);
  });

  test('Debe solicitar recuperación de contraseña y mostrar confirmación', async ({ page }) => {
    await page.goto('/');

    // Asegurar estar en modo login
    const loginTab = page.locator('button[data-switch-auth="login"]');
    if (await loginTab.isVisible()) {
      await loginTab.click();
    }

    // Clic en ¿Olvidaste tu contraseña?
    const forgotBtn = page.locator('button[data-action="open-forgot-password"]');
    await expect(forgotBtn).toBeVisible();
    await forgotBtn.click();

    // Llenar modal de recuperación
    const forgotModal = page.locator('#form-forgot-pass');
    await expect(forgotModal).toBeVisible();
    await forgotModal.locator('input[name="email"]').fill(testEmail);
    await forgotModal.locator('button[type="submit"]').click();

    // Verificar mensaje de confirmación
    const msg = page.locator('#forgot-pass-msg');
    await expect(msg).toContainText(/enlace/i);
  });
});

