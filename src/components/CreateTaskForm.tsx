'use client';

import { useState, type FormEvent } from 'react';
import { useNotifications } from '@/hooks/useNotifications';

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
    <section className="create-section">
      <h2>Створити нове завдання</h2>
      <form id="create-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="new-task-input"
            placeholder="Введіть назву завдання..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            ➕ Додати
          </button>
        </div>
      </form>
    </section>
  );
}
