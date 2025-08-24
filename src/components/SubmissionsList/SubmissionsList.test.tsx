// src/components/SubmissionsList/SubmissionsList.test.tsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils/render';
import { SubmissionsList } from './SubmissionsList';
import type { Submission } from '../../store/slices/formsSlice';

function fakeSubmission(
  id: string,
  name: string,
  source: Submission['source'] = 'rhf'
): Submission {
  return {
    id,
    source,
    isNew: false,
    createdAt: Date.now(),
    data: {
      name,
      age: 22,
      email: `${name.toLowerCase()}@example.com`,
      password: 'Aa1@aaaa',
      confirmPassword: 'Aa1@aaaa',
      gender: 'male',
      acceptTC: true,
      country: 'Germany',
      pictureBase64: null,
    },
  };
}

describe('SubmissionsList', () => {
  it('renders empty state when no items', () => {
    renderWithProviders(<SubmissionsList items={[]} />);
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('renders a grid of cards when items provided', () => {
    const items: Submission[] = [
      fakeSubmission('1', 'Alice'),
      fakeSubmission('2', 'Bob', 'uncontrolled'),
    ];

    renderWithProviders(<SubmissionsList items={items} />);

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /alice/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /bob/i })).toBeInTheDocument();
  });
});
