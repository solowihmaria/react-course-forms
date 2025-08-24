import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/render';
import App from './App';

describe('App ', () => {
  it('renders title, buttons and empty state', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { name: /form app/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open rhf form/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/no submissions yet — fill any form/i)
    ).toBeInTheDocument();
  });

  it('opens Uncontrolled Form modal and closes with ESC', async () => {
    renderWithProviders(<App />);

    await userEvent.click(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    );

    const dialog = await screen.findByRole('dialog', {
      name: /uncontrolled form/i,
    });
    expect(dialog).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens RHF Form modal and has disabled submit initially', async () => {
    renderWithProviders(<App />);

    await userEvent.click(
      screen.getByRole('button', { name: /open rhf form/i })
    );

    const dialog = await screen.findByRole('dialog', {
      name: /react hook form/i,
    });
    expect(dialog).toBeInTheDocument();

    const submit = screen.getByRole('button', { name: /submit/i });
    expect(submit).toBeDisabled();
  });
});
