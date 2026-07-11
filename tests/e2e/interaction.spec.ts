import { test, expect } from '@playwright/test';

test.describe('Flyin E2E Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open popup when clicking launch button', async ({ page }) => {
    await page.click('#launch-demo');
    // Wait for the popup to appear (onLoadDelay is 500ms by default)
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog).toContainText('Welcome to Flyin!');
  });

  test('should close popup when clicking close button', async ({ page }) => {
    await page.click('#launch-demo');
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    const closeBtn = dialog.locator('.flyin-button-close');
    await closeBtn.click();
    
    await expect(dialog).not.toBeVisible();
  });

  test('should close popup when clicking overlay', async ({ page }) => {
    await page.click('#launch-demo');
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    const overlay = page.locator('.flyin-overlay');
    // Click at the top-left of the overlay to ensure we don't click the dialog
    await overlay.click({ position: { x: 10, y: 10 }, force: true });
    
    await expect(dialog).not.toBeVisible();
  });
  
  test('should close popup on Escape key', async ({ page }) => {
    await page.click('#launch-demo');
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    await page.keyboard.press('Escape');
    
    await expect(dialog).not.toBeVisible();
  });
});
