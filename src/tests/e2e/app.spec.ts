import { expect, test } from '@playwright/test';

test('shows the GraphQL demo', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', {
            level: 1,
            name: 'GraphQL examples',
        }),
    ).toBeVisible();

    await expect(page.getByLabel('User ID')).toBeVisible();

    await expect(page.getByRole('button', { name: 'Find user' })).toBeVisible();
});
