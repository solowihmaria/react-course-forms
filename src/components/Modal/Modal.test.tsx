import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';

function openModal(
  ui?: React.ReactNode,
  props?: Partial<React.ComponentProps<typeof Modal>>
) {
  const onClose = vi.fn();
  render(
    <Modal isOpen title="Test Modal" onClose={onClose} {...props}>
      {ui ?? <button>Inside content</button>}
    </Modal>
  );
  return onClose;
}

describe('Modal (portal + a11y)', () => {
  it('renders into #modal-root via portal', async () => {
    openModal();
    const host = document.getElementById('modal-root');
    expect(host).toBeTruthy();
    const dialog = await screen.findByRole('dialog', { name: /test modal/i });
    expect(host?.contains(dialog)).toBe(true);
  });

  it('shows when isOpen=true and unmounts when isOpen=false', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen title="Test Modal" onClose={onClose}>
        <button>Inside</button>
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    rerender(
      <Modal isOpen={false} title="Test Modal" onClose={onClose}>
        <button>Inside</button>
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves focus inside on open (focus management)', async () => {
    openModal();
    const closeBtn = screen.getByLabelText(/close modal/i);
    await waitFor(() => expect(closeBtn).toHaveFocus());
  });

  it('closes on ESC key', () => {
    const onClose = openModal();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop mouse down', () => {
    const onClose = openModal();
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT close when mousedown inside the dialog content', () => {
    const onClose = openModal(<button>Inside content</button>);
    const dialog = screen.getByRole('dialog');
    fireEvent.mouseDown(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });
});
