import { test, expect } from '@playwright/test';

test.describe('Flyin Visual Regression', () => {
  test('should look correct on initial launch', async ({ page }) => {
    await page.goto('/');
    await page.click('#launch-demo');
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // Wait for animations to finish (effectSpeed is 0.7s)
    await page.waitForTimeout(1000);
    
    // Using a more lenient threshold for different environments
    await expect(dialog).toHaveScreenshot('demo-popup.png', {
      maxDiffPixelRatio: 0.1,
    });
  });
});
