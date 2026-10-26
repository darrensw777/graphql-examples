import { expect, test } from '@playwright/test';

test('looks up different users by ID', async ({ page }) => {
    await page.goto('/');

    const input = page.getByLabel('User ID');
    const button = page.getByRole('button', { name: 'Find user' });

    await input.fill('1');
    await button.click();

    await expect(page.getByRole('heading', { name: 'Darren', exact: true })).toBeVisible();

    await expect(page.getByText('darren@example.com', { exact: true })).toBeVisible();

    const posts = page.getByRole('list', { name: 'User posts' });

    await expect(
        posts.getByRole('listitem').filter({ hasText: 'Understanding vocal harmonies' }),
    ).toBeVisible();

    await expect(
        posts.getByRole('listitem').filter({ hasText: 'Building my studio website' }),
    ).toBeVisible();

    await input.fill('2');
    await button.click();

    await expect(page.getByRole('heading', { name: 'Sarah', exact: true })).toBeVisible();

    await expect(page.getByText('sarah@example.com', { exact: true })).toBeVisible();

    await expect(posts.getByRole('listitem')).toHaveCount(1);
    await expect(posts.getByRole('listitem')).toHaveText('Learning GraphQL');

    await expect(page.getByRole('heading', { name: 'Darren', exact: true })).toHaveCount(0);
});

test('shows a message when the user does not exist', async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('User ID').fill('999');
    await page.getByRole('button', { name: 'Find user' }).click();

    await expect(page.getByText('No user found.', { exact: true })).toBeVisible();
});

test('renames a user and keeps the change after a page reload', async ({ page }) => {
    try {
        await page.goto('/');

        await page.getByLabel('User ID').fill('1');
        await page.getByRole('button', { name: 'Find user' }).click();

        await expect(page.getByRole('heading', { name: 'Darren', exact: true })).toBeVisible();

        await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Darren Sweeney');
        await page.getByRole('button', { name: 'Save name' }).click();

        await expect(page.getByRole('status')).toHaveText('Name updated.');

        await expect(
            page.getByRole('heading', { name: 'Darren Sweeney', exact: true }),
        ).toBeVisible();

        await page.reload();

        await page.getByLabel('User ID').fill('1');
        await page.getByRole('button', { name: 'Find user' }).click();

        await expect(
            page.getByRole('heading', { name: 'Darren Sweeney', exact: true }),
        ).toBeVisible();

        await expect(
            page.getByRole('list', { name: 'User posts' }).getByRole('listitem'),
        ).toHaveCount(2);
    } finally {
        const response = await page.request.post('/graphql', {
            data: {
                query: `
                    mutation RestoreUserName($id: ID!, $name: String!) {
                        updateUserName(id: $id, name: $name) {
                            id
                            name
                        }
                    }
                `,
                variables: {
                    id: '1',
                    name: 'Darren',
                },
            },
        });

        expect(response.ok()).toBeTruthy();

        const result = await response.json();

        expect(result.errors).toBeUndefined();
        expect(result.data.updateUserName.name).toBe('Darren');
    }
});
