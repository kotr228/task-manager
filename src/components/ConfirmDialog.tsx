'use client';

import { useEffect, useRef } from 'react';
import { TrashIcon } from './icons';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, description, confirmLabel, onConfirm, onCancel }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="overlay" onMouseDown={onCancel}>
      <div
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="dialog__icon">
          <TrashIcon />
        </span>
        <h3 id="dialog-title">{title}</h3>
        <p id="dialog-desc">{description}</p>
        <div className="dialog__actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Скасувати
          </button>
          <button ref={confirmRef} type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
