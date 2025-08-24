import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '../../test-utils/render';
import { SubmissionCard } from './SubmissionCard';
import { store } from '../../store/store';
import { clearNewFlag } from '../../store/slices/formsSlice';

const baseData = {
  name: 'John',
  age: 22,
  email: 'john@example.com',
  password: 'Aa1@aaaa',
  confirmPassword: 'Aa1@aaaa',
  gender: 'male' as const,
  acceptTC: true,
  country: 'Germany',
  pictureBase64: null as string | null,
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('SubmissionCard', () => {
  it('renders basic info and source badge', () => {
    renderWithProviders(
      <SubmissionCard id="id-1" source="rhf" data={baseData} isNew={false} />
    );

    expect(screen.getByRole('heading', { name: /john/i })).toBeInTheDocument();

    expect(screen.getByText(/rhf/i)).toBeInTheDocument();

    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Age:')).toBeInTheDocument();
    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText('Country:')).toBeInTheDocument();

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
  });

  it('renders avatar when pictureBase64 provided', () => {
    const dataWithPic = {
      ...baseData,
      pictureBase64: 'data:image/png;base64,AAA',
    };
    renderWithProviders(
      <SubmissionCard
        id="id-2"
        source="uncontrolled"
        data={dataWithPic}
        isNew={false}
      />
    );

    const img = screen.getByRole('img', { name: /john's picture/i });
    expect(img).toBeInTheDocument();
    expect((img as HTMLImageElement).src).toMatch(/^data:image\/png;base64/);
  });

  it('dispatches clearNewFlag after 3s when isNew=true', () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(
      <SubmissionCard id="id-3" source="rhf" data={baseData} isNew={true} />
    );

    vi.advanceTimersByTime(3000);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: clearNewFlag.type,
        payload: 'id-3',
      })
    );

    vi.useRealTimers();
  });

  it('does not dispatch clearNewFlag when isNew=false', () => {
    vi.useFakeTimers();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(
      <SubmissionCard id="id-4" source="rhf" data={baseData} isNew={false} />
    );

    vi.advanceTimersByTime(4000);
    expect(dispatchSpy).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
