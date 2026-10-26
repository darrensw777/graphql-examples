import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RenameUserForm from '../components/RenameUserForm';
import type { User } from '../api/users';

const originalUser: User = {
    id: '1',
    name: 'Darren',
    email: 'darren@example.com',
    posts: [],
};

function mockGraphQLResponse(body: unknown) {
    const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(body), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        }),
    );

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('RenameUserForm', () => {
    it('sends the new name and passes the updated user to its parent', async () => {
        const updatedUser: User = {
            ...originalUser,
            name: 'Darren Sweeney',
        };

        const fetchMock = mockGraphQLResponse({
            data: {
                updateUserName: updatedUser,
            },
        });

        const onUpdated = vi.fn();
        const user = userEvent.setup();

        render(<RenameUserForm user={originalUser} onUpdated={onUpdated} />);

        await user.clear(screen.getByRole('textbox', { name: 'Name' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Darren Sweeney');
        await user.click(screen.getByRole('button', { name: 'Save name' }));

        expect(await screen.findByRole('status')).toHaveTextContent('Name updated.');
        expect(onUpdated).toHaveBeenCalledExactlyOnceWith(updatedUser);

        const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
        const body = JSON.parse(request.body as string);

        expect(body.variables).toEqual({
            id: '1',
            name: 'Darren Sweeney',
        });
    });

    it('disables saving when the name contains only spaces', async () => {
        const onUpdated = vi.fn();
        const user = userEvent.setup();

        render(<RenameUserForm user={originalUser} onUpdated={onUpdated} />);

        await user.clear(screen.getByRole('textbox', { name: 'Name' }));
        await user.type(screen.getByRole('textbox', { name: 'Name' }), '   ');

        expect(screen.getByRole('button', { name: 'Save name' })).toBeDisabled();
        expect(onUpdated).not.toHaveBeenCalled();
    });

    it('displays server errors without reporting a successful update', async () => {
        mockGraphQLResponse({
            errors: [
                {
                    message: 'Unable to save the name.',
                },
            ],
        });

        const onUpdated = vi.fn();
        const user = userEvent.setup();

        render(<RenameUserForm user={originalUser} onUpdated={onUpdated} />);

        await user.click(screen.getByRole('button', { name: 'Save name' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Unable to save the name.');
        expect(onUpdated).not.toHaveBeenCalled();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
