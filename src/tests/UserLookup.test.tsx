import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UserLookup from '../components/UserLookup';

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

describe('UserLookup', () => {
    it('sends the entered ID and displays the matching user', async () => {
        const fetchMock = mockGraphQLResponse({
            data: {
                user: {
                    id: '2',
                    name: 'Sarah',
                    email: 'sarah@example.com',
                    posts: [
                        {
                            id: '103',
                            title: 'Learning GraphQL',
                        },
                    ],
                },
            },
        });

        const user = userEvent.setup();

        render(<UserLookup />);

        await user.clear(screen.getByLabelText('User ID'));
        await user.type(screen.getByLabelText('User ID'), '2');
        await user.click(screen.getByRole('button', { name: 'Find user' }));

        expect(await screen.findByRole('heading', { name: 'Sarah' })).toBeInTheDocument();

        expect(screen.getByText('sarah@example.com')).toBeInTheDocument();

        expect(screen.getByText('Learning GraphQL')).toBeInTheDocument();

        expect(fetchMock).toHaveBeenCalledWith(
            '/graphql',
            expect.objectContaining({
                method: 'POST',
                body: expect.any(String),
            }),
        );

        const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
        const body = JSON.parse(request.body as string);

        expect(body.variables).toEqual({ id: '2' });
    });

    it('shows a message when no user matches', async () => {
        mockGraphQLResponse({
            data: {
                user: null,
            },
        });

        const user = userEvent.setup();

        render(<UserLookup />);

        await user.click(screen.getByRole('button', { name: 'Find user' }));

        expect(await screen.findByText('No user found.')).toBeInTheDocument();
    });

    it('displays GraphQL errors returned by the server', async () => {
        mockGraphQLResponse({
            errors: [
                {
                    message: 'Unable to load user.',
                },
            ],
        });

        const user = userEvent.setup();

        render(<UserLookup />);

        await user.click(screen.getByRole('button', { name: 'Find user' }));

        expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load user.');
    });
});
