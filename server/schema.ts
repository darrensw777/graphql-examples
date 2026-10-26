import { createSchema } from 'graphql-yoga';

const users = [
    {
        id: '1',
        name: 'Darren',
        email: 'darren@example.com',
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@example.com',
    },
];

const posts = [
    {
        id: '101',
        title: 'Understanding vocal harmonies',
        authorId: '1',
    },
    {
        id: '102',
        title: 'Building my studio website',
        authorId: '1',
    },
    {
        id: '103',
        title: 'Learning GraphQL',
        authorId: '2',
    },
];

export const schema = createSchema({
    typeDefs: /* GraphQL */ `
        type User {
            id: ID!
            name: String!
            email: String!
            posts: [Post!]!
        }

        type Query {
            users: [User!]!
            user(id: ID!): User
        }

        type Mutation {
            updateUserName(id: ID!, name: String!): User
        }

        type Post {
            id: ID!
            title: String!
        }
    `,
    resolvers: {
        Query: {
            users: () => users,
            user: (_parent: unknown, { id }: { id: string }) => {
                return users.find((user) => user.id === id) ?? null;
            },
        },
        User: {
            posts: (parent: { id: string }) => {
                return posts.filter((post) => post.authorId === parent.id);
            },
        },
        Mutation: {
            updateUserName: (_parent: unknown, { id, name }: { id: string; name: string }) => {
                const user = users.find((user) => user.id === id);

                if (!user) {
                    return null;
                }

                const trimmedName = name.trim();

                if (!trimmedName) {
                    throw new Error('Name cannot be empty.');
                }

                user.name = trimmedName;

                return user;
            },
        },
    },
});
