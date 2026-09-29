'use client';

import { useState, type FormEvent } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { PlusIcon } from './icons';

interface Props {
  onCreate: (title: string) => Promise<boolean>;
}

export default function CreateTaskForm({ onCreate }: Props) {
  const { notify } = useNotifications();
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      notify('Введіть назву завдання', 'error');
      return;
    }

    setSubmitting(true);
    if (await onCreate(trimmed)) {
      setTitle('');
    }
    setSubmitting(false);
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task-input" className="sr-only">
        Назва нового завдання
      </label>
      <span className="create-form__icon">
        <PlusIcon />
      </span>
      <input
        type="text"
        id="new-task-input"
        placeholder="Що потрібно зробити?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={200}
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary" disabled={submitting || !title.trim()}>
        {submitting ? 'Додаємо…' : 'Додати завдання'}
      </button>
    </form>
  );
}
