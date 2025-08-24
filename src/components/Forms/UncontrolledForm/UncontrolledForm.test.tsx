import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils/render';
import { UncontrolledForm } from './UncontrolledForm';
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

describe('UncontrolledForm', () => {
  it('renders all required fields', () => {
    renderWithProviders(<UncontrolledForm onSuccess={() => {}} />);

    expect(get.name()).toBeInTheDocument();
    expect(get.age()).toBeInTheDocument();
    expect(get.email()).toBeInTheDocument();
    expect(get.password()).toBeInTheDocument();
    expect(get.confirmPassword()).toBeInTheDocument();
    expect(get.genderMale()).toBeInTheDocument();
    expect(get.acceptTC()).toBeInTheDocument();
    expect(get.country()).toBeInTheDocument();
    expect(get.submit()).toBeInTheDocument();
  });

  it('shows validation errors on submit (no live validation)', async () => {
    renderWithProviders(<UncontrolledForm onSuccess={() => {}} />);
    await userEvent.click(get.submit());

    expect(
      await screen.findByText(
        /(enter your name|first letter must be uppercase)/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/enter your email/i)).toBeInTheDocument();

    expect(
      screen.getByText(/(enter your password|at least 8|weak password)/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/confirm your password/i)).toBeInTheDocument();

    expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();

    expect(screen.getByText(/select a country/i)).toBeInTheDocument();
  });

  it('updates password strength indicator when typing', async () => {
    renderWithProviders(<UncontrolledForm onSuccess={() => {}} />);

    expect(screen.getByText(/empty/i)).toBeInTheDocument();

    await userEvent.type(get.password(), 'Aa1@aaaa');

    expect(screen.queryByText(/empty/i)).not.toBeInTheDocument();
  });

  it('submits valid data, dispatches addSubmission and calls onSuccess', async () => {
    const onSuccess = vi.fn();
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    renderWithProviders(<UncontrolledForm onSuccess={onSuccess} />);

    await userEvent.type(get.name(), 'John');
    await userEvent.clear(get.age());
    await userEvent.type(get.age(), '22');
    await userEvent.type(get.email(), 'john@example.com');
    await userEvent.type(get.password(), 'Aa1@aaaa');
    await userEvent.type(get.confirmPassword(), 'Aa1@aaaa');
    await userEvent.click(get.genderMale());
    await userEvent.click(get.acceptTC());
    await userEvent.type(get.country(), 'Germany');

    await userEvent.click(get.submit());

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: addSubmission.type })
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('clears previous errors after fixing data and resubmitting', async () => {
    renderWithProviders(<UncontrolledForm onSuccess={() => {}} />);

    await userEvent.click(get.submit());
    const nameError = await screen.findByText(
      /(enter your name|first letter must be uppercase)/i
    );
    expect(nameError).toBeInTheDocument();

    await userEvent.type(get.name(), 'John');
    await userEvent.clear(get.age());
    await userEvent.type(get.age(), '18');
    await userEvent.type(get.email(), 'john@example.com');
    await userEvent.type(get.password(), 'Aa1@aaaa');
    await userEvent.type(get.confirmPassword(), 'Aa1@aaaa');
    await userEvent.click(get.genderMale());
    await userEvent.click(get.acceptTC());
    await userEvent.type(get.country(), 'Germany');

    await userEvent.click(get.submit());

    expect(
      screen.queryByText(/(enter your name|first letter must be uppercase)/i)
    ).not.toBeInTheDocument();
  });
});
