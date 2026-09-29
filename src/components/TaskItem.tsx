'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { TaskEntry } from '@/hooks/useTasks';
import { CheckIcon, PencilIcon, TrashIcon, XIcon } from './icons';

interface Props {
  task: TaskEntry;
  onToggle: (task: TaskEntry, completed: boolean) => void;
  onRename: (task: TaskEntry, title: string) => void;
  onDelete: (task: TaskEntry) => void;
}

export default function TaskItem({ task, onToggle, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function startEdit() {
    setDraft(task.title);
    setEditing(true);
  }

  function save() {
    const title = draft.trim();
    setEditing(false);
    if (title && title !== task.title) {
      onRename(task, title);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') save();
    if (event.key === 'Escape') setEditing(false);
  }

  const className = ['task', task.completed && 'task--done', task.removing && 'task--removing']
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className} data-id={task.id}>
      <label className="check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task, e.target.checked)}
          aria-label={`Позначити «${task.title}» як виконане`}
        />
        <span className="check__box">
          <CheckIcon />
        </span>
      </label>

      <div className="task__body">
        {editing ? (
          <input
            ref={inputRef}
            className="task__edit"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={save}
            aria-label="Нова назва завдання"
            maxLength={200}
          />
        ) : (
          <span className="task__title" onDoubleClick={startEdit}>
            {task.title}
          </span>
        )}
        <span className="task__meta">
          <span className="chip">#{task.id}</span>
          <span className={`badge ${task.completed ? 'badge--done' : 'badge--active'}`}>
            {task.completed ? 'Виконано' : 'В роботі'}
          </span>
        </span>
      </div>

      <div className="task__actions">
        {editing ? (
          <>
            <button type="button" className="icon-btn icon-btn--ok" onMouseDown={(e) => e.preventDefault()} onClick={save} title="Зберегти">
              <CheckIcon />
            </button>
            <button
              type="button"
              className="icon-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setEditing(false)}
              title="Скасувати"
            >
              <XIcon />
            </button>
          </>
        ) : (
          <>
            <button type="button" className="icon-btn" onClick={startEdit} title="Редагувати" aria-label="Редагувати">
              <PencilIcon />
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--danger"
              onClick={() => onDelete(task)}
              title="Видалити"
              aria-label="Видалити"
            >
              <TrashIcon />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
