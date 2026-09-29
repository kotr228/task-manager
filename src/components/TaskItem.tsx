'use client';

import type { TaskEntry } from '@/hooks/useTasks';

interface Props {
  task: TaskEntry;
  onToggle: (task: TaskEntry, completed: boolean) => void;
  onRename: (task: TaskEntry, title: string) => void;
  onDelete: (task: TaskEntry) => void;
}

export default function TaskItem({ task, onToggle, onRename, onDelete }: Props) {
  function handleEdit() {
    const newTitle = window.prompt('Введіть нову назву завдання:', task.title)?.trim();
    if (newTitle && newTitle !== task.title) {
      onRename(task, newTitle);
    }
  }

  function handleDelete() {
    if (window.confirm('Ви впевнені, що хочете видалити це завдання?')) {
      onDelete(task);
    }
  }

  const className = ['task-item', task.completed && 'completed', task.removing && 'removing']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} data-id={task.id}>
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={(e) => onToggle(task, e.target.checked)}
          aria-label={`Позначити «${task.title}» як виконане`}
        />
        <div className="task-text">
          <span className="task-title">{task.title}</span>
          <span className="task-id">ID: {task.id}</span>
        </div>
      </div>
      <div className="task-actions">
        <button type="button" className="btn-edit" onClick={handleEdit}>
          ✏️ Редагувати
        </button>
        <button type="button" className="btn-delete" onClick={handleDelete}>
          🗑️ Видалити
        </button>
      </div>
    </div>
  );
}
