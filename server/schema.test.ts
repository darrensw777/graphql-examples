import { graphql } from 'graphql';
import { describe, expect, it } from 'vitest';
import { schema } from './schema';

const mutation = `
    mutation UpdateUserName($id: ID!, $name: String!) {
        updateUserName(id: $id, name: $name) {
            id
            name
        }
    }
`;

describe('updateUserName', () => {
    it('updates the user and makes the new name available to queries', async () => {
        try {
            const result = await graphql({
                schema,
                source: mutation,
                variableValues: {
                    id: '1',
                    name: '  Darren Sweeney  ',
                },
            });

            expect(result.errors).toBeUndefined();
            expect(result.data).toEqual({
                updateUserName: {
                    id: '1',
                    name: 'Darren Sweeney',
                },
            });

            const queryResult = await graphql({
                schema,
                source: `
                    query {
                        user(id: "1") {
                            name
                        }
                    }
                `,
            });

            expect(queryResult.errors).toBeUndefined();
            expect(queryResult.data).toEqual({
                user: {
                    name: 'Darren Sweeney',
                },
            });
        } finally {
            await graphql({
                schema,
                source: mutation,
                variableValues: {
                    id: '1',
                    name: 'Darren',
                },
            });
        }
    });

    it('rejects a name containing only spaces', async () => {
        const result = await graphql({
            schema,
            source: mutation,
            variableValues: {
                id: '1',
                name: '   ',
            },
        });

        expect(result.errors?.map((error) => error.message)).toContain('Name cannot be empty.');
        expect(result.data).toEqual({
            updateUserName: null,
        });
    });

    it('returns null when the user does not exist', async () => {
        const result = await graphql({
            schema,
            source: mutation,
            variableValues: {
                id: '999',
                name: 'Someone',
            },
        });

        expect(result.errors).toBeUndefined();
        expect(result.data).toEqual({
            updateUserName: null,
        });
    });
});
