import { test, expect } from '@playwright/test';

test.describe('Add to Cart Flow', () => {
  test('should show notification dialog when Add to Cart button is clicked', async ({
    page,
  }) => {
    // Navigate to the demo page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page title/heading is visible
    await expect(page.getByRole('heading', { name: 'NextMQ Demo' })).toBeVisible();

    // Verify the "Add to Cart" button is visible
    const addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCartButton).toBeVisible();

    // Click the "Add to Cart" button
    await addToCartButton.click();

    // Wait for the notification dialog to appear
    // The notification has a test ID and shows "Added to Cart!" text
    const notification = page.getByTestId('cart-added-notification');
    await expect(notification).toBeVisible({ timeout: 2000 });

    // Verify the notification contains the expected content
    await expect(notification.getByText('Added to Cart!')).toBeVisible();
    await expect(notification.getByText('EAN: 1234567890123 × 1')).toBeVisible();

    // Verify the notification has the correct styling (green background)
    await expect(notification).toHaveCSS('background-color', 'rgb(76, 175, 80)'); // #4CAF50
    await expect(notification).toHaveCSS('position', 'fixed');
  });

  test('should dispatch CustomEvent when Add to Cart button is clicked', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Listen for the CustomEvent
    const eventPromise = page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('nextmq:invoke', (event: Event) => {
          const customEvent = event as CustomEvent;
          resolve({
            type: customEvent.detail.type,
            payload: customEvent.detail.payload,
          });
        });
      });
    });

    // Click the button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Wait for the event
    const eventData = await eventPromise;

    // Verify the event data
    expect(eventData).toEqual({
      type: 'cart.add',
      payload: {
        ean: '1234567890123',
        quantity: 1,
      },
    });
  });

  test('should process job and render notification via NextMQ', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click Add to Cart button
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Wait for the notification to appear (this confirms the full flow works:
    // CustomEvent → EventBridge → Provider → Processor → Handler → JSX rendering)
    const notification = page.getByTestId('cart-added-notification');
    await expect(notification).toBeVisible({
      timeout: 2000,
    });

    // Verify the notification is rendered in the correct location (fixed position, top-right)
    const box = await notification.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      // Notification should be positioned near top-right (allowing for some margin)
      // For a typical desktop viewport (1280x720), right side would be > 800px
      expect(box.x).toBeGreaterThan(600); // Right side of screen
      expect(box.y).toBeLessThan(100); // Near top (20px + some margin)
    }
  });
});

