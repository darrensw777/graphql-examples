import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
    it('shows the demo heading and user lookup', () => {
        render(<App />);

        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'GraphQL examples',
            }),
        ).toBeInTheDocument();

        expect(screen.getByLabelText('User ID')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Find user' })).toBeInTheDocument();
    });
});
