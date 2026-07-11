import { test, expect } from '@playwright/test';

test.describe('Flyin E2E Persistence', () => {
  test('should save and restore position', async ({ page }) => {
    await page.goto('/examples/persistence.html');
    
    await page.click('#launch-persistent');
    const dialog = page.locator('.flyin-dialog');
    await expect(dialog).toBeVisible();
    
    // Check initial position (set in settings: 100, 100)
    let box = await dialog.boundingBox();
    expect(box?.x).toBe(100);
    expect(box?.y).toBe(100);
    
    // Drag the header to move the popup
    const header = dialog.locator('.flyin-header');
    await header.hover();
    await page.mouse.down();
    await page.mouse.move(500, 500); // Move it significantly
    await page.mouse.up();
    
    // Get the position after move
    box = await dialog.boundingBox();
    const savedX = box?.x;
    const savedY = box?.y;
    
    // Reload page
    await page.reload();
    
    // Launch again
    await page.click('#launch-persistent');
    await expect(dialog).toBeVisible();
    
    // Position should be restored from LocalStorage
    const newBox = await dialog.boundingBox();
    expect(newBox?.x).toBe(savedX);
    expect(newBox?.y).toBe(savedY);
  });
});
