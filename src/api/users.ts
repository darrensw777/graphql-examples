export type Post = {
    id: string;
    title: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    posts: Post[];
};

type GetUserResponse = {
    data?: {
        user: User | null;
    } | null;
    errors?: Array<{
        message: string;
    }>;
};

const getUserQuery = `
    query GetUser($id: ID!) {
        user(id: $id) {
            id
            name
            email
            posts {
                id
                title
            }
        }
    }
`;

type UpdateUserNameResponse = {
    data?: {
        updateUserName: User | null;
    } | null;
    errors?: Array<{
        message: string;
    }>;
};

const updateUserNameMutation = `
    mutation UpdateUserName($id: ID!, $name: String!) {
        updateUserName(id: $id, name: $name) {
            id
            name
            email
            posts {
                id
                title
            }
        }
    }
`;

export async function updateUserName(id: string, name: string): Promise<User> {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: updateUserNameMutation,
            variables: { id, name },
        }),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const result: UpdateUserNameResponse = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join(', '));
    }

    if (!result.data?.updateUserName) {
        throw new Error('User not found.');
    }

    return result.data.updateUserName;
}

export async function getUser(id: string): Promise<User | null> {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: getUserQuery,
            variables: { id },
        }),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    const result: GetUserResponse = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors.map((error) => error.message).join(', '));
    }

    if (!result.data) {
        throw new Error('The server returned no data.');
    }

    return result.data.user;
}
