import { useState } from 'react';
import type { FormEvent } from 'react';
import { updateUserName } from '../api/users';
import type { User } from '../api/users';

type RenameUserFormProps = {
    user: User;
    onUpdated: (user: User) => void;
};

export default function RenameUserForm({ user, onUpdated }: RenameUserFormProps) {
    const [name, setName] = useState(user.name);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSaving(true);
        setError(null);
        setSaved(false);

        try {
            const updatedUser = await updateUserName(user.id, name.trim());

            setName(updatedUser.name);
            onUpdated(updatedUser);
            setSaved(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to update user.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="user-name">Name </label>
            <input
                id="user-name"
                value={name}
                onChange={(event) => {
                    setName(event.target.value);
                    setSaved(false);
                }}
                disabled={saving}
            />

            <button type="submit" disabled={saving || !name.trim()}>
                {saving ? 'Saving...' : 'Save name'}
            </button>

            {error && <p role="alert">{error}</p>}
            {saved && <p role="status">Name updated.</p>}
        </form>
    );
}
