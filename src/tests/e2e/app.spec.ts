import { expect, test } from '@playwright/test';

test('increments the counter when clicked', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', {
        name: /count is 0/i,
    });

    await button.click();

    await expect(
        page.getByRole('button', { name: /count is 1/i }),
    ).toBeVisible();
});