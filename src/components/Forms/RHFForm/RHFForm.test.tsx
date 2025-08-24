import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils/render';
import { RHFForm } from './RHFForm';
import { store } from '../../../store/store';
import { addSubmission } from '../../../store/slices/formsSlice';

const get = {
  name: () => screen.getByLabelText(/^name$/i),
  age: () => screen.getByLabelText(/^age$/i),
  email: () => screen.getByLabelText(/^email$/i),
  password: () => screen.getByLabelText(/^password$/i),
  confirmPassword: () => screen.getByLabelText(/^confirm password$/i),
  genderMale: () => screen.getByLabelText(/^male$/i),
  acceptTC: () => screen.getByLabelText(/terms/i),
  country: () => screen.getByLabelText(/^country$/i),
  submit: () => screen.getByRole('button', { name: /submit/i }),
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('RHFForm', () => {
  it('renders all required fields and submit is disabled initially', () => {
    renderWithProviders(<RHFForm onSuccess={() => {}} />);

    expect(get.name()).toBeInTheDocument();
    expect(get.age()).toBeInTheDocument();
    expect(get.email()).toBeInTheDocument();
    expect(get.password()).toBeInTheDocument();
    expect(get.confirmPassword()).toBeInTheDocument();
    expect(get.genderMale()).toBeInTheDocument();
    expect(get.acceptTC()).toBeInTheDocument();
    expect(get.country()).toBeInTheDocument();

    expect(get.submit()).toBeDisabled();
  });

  it('live validation: shows and clears errors while typing', async () => {
    renderWithProviders(<RHFForm onSuccess={() => {}} />);

    await userEvent.type(get.name(), 'john');
    expect(
      await screen.findByText(/first letter must be uppercase/i)
    ).toBeInTheDocument();

    await userEvent.clear(get.name());
    await userEvent.type(get.name(), 'John');
    await waitFor(() =>
      expect(
        screen.queryByText(/first letter must be uppercase/i)
      ).not.toBeInTheDocument()
    );
  });

  it('updates password strength indicator when typing (label changes from "empty")', async () => {
    renderWithProviders(<RHFForm onSuccess={() => {}} />);
    expect(screen.getByText(/empty/i)).toBeInTheDocument();

    await userEvent.type(get.password(), 'Aa1@aaaa');

    expect(screen.queryByText(/empty/i)).not.toBeInTheDocument();
  });

  it('enables submit when the form becomes valid and then submits', async () => {
    const onSuccess = vi.fn();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<RHFForm onSuccess={onSuccess} />);

    await userEvent.type(get.name(), 'John');
    await userEvent.clear(get.age());
    await userEvent.type(get.age(), '22');
    await userEvent.type(get.email(), 'john@example.com');
    await userEvent.type(get.password(), 'Aa1@aaaa');
    await userEvent.type(get.confirmPassword(), 'Aa1@aaaa');
    await userEvent.click(get.genderMale());
    await userEvent.click(get.acceptTC());
    await userEvent.type(get.country(), 'Germany');

    await waitFor(() => expect(get.submit()).not.toBeDisabled());

    await userEvent.click(get.submit());

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: addSubmission.type })
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('shows errors for invalid email and mismatched passwords (onChange)', async () => {
    renderWithProviders(<RHFForm onSuccess={() => {}} />);

    await userEvent.type(get.email(), 'not-an-email');
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();

    await userEvent.type(get.password(), 'Aa1@aaaa');
    await userEvent.type(get.confirmPassword(), 'different');
    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });
});
