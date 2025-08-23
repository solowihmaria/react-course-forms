import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.scss';

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusFirst = () => {
      const root = dialogRef.current;
      if (!root) return;
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      (first || root).focus();
    };
    setTimeout(focusFirst, 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const root = dialogRef.current;
        if (!root) return;

        const list = Array.from(
          root.querySelectorAll<HTMLElement>(FOCUSABLE)
        ).filter((el) => !el.hasAttribute('disabled'));

        if (list.length === 0) {
          e.preventDefault();
          root.focus();
          return;
        }

        const first = list[0];
        const last = list[list.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last || !root.contains(active)) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const host = document.getElementById('modal-root') || document.body;

  const closeOnBackdrop = () => onClose();
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className={s.backdrop}
      role="presentation"
      onMouseDown={closeOnBackdrop}
    >
      <div
        className={s.window}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onMouseDown={stop}
      >
        {title && (
          <h2 id={titleId} className={s.title}>
            {title}
          </h2>
        )}

        <button
          type="button"
          className={s.closeBtn}
          aria-label="Close modal"
          onClick={onClose}
        >
          ×
        </button>

        {children}
      </div>
    </div>,
    host
  );
}
