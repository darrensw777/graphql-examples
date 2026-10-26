import { useState } from 'react';
import { getUser } from '../api/users';
import type { User } from '../api/users';
import RenameUserForm from './RenameUserForm';

export default function UserLookup() {
    const [id, setId] = useState('1');
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    async function handleLookup() {
        setLoading(true);
        setError(null);
        setUser(null);
        setSearched(false);

        try {
            const result = await getUser(id.trim());

            setUser(result);
            setSearched(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>User lookup</h2>

            <label htmlFor="user-id">User ID </label>
            <input
                id="user-id"
                value={id}
                onChange={(event) => setId(event.target.value)}
                disabled={loading}
            />

            <button type="button" onClick={handleLookup} disabled={loading || !id.trim()}>
                {loading ? 'Loading...' : 'Find user'}
            </button>

            {error && <p role="alert">{error}</p>}

            {searched && !user && <p>No user found.</p>}

            {user && (
                <div>
                    <h3>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>ID: {user.id}</p>

                    <RenameUserForm key={user.id} user={user} onUpdated={setUser} />

                    <h4>Posts</h4>

                    {user.posts.length > 0 ? (
                        <ul aria-label="User posts">
                            {user.posts.map((post) => (
                                <li key={post.id}>{post.title}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>This user has no posts.</p>
                    )}
                </div>
            )}
        </section>
    );
}
