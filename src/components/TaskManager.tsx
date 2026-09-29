'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePersistedPage } from '@/hooks/usePersistedPage';
import { LIMIT, useTasks, type TaskEntry } from '@/hooks/useTasks';
import type { TaskFilter } from '@/types/task';
import ConfirmDialog from './ConfirmDialog';
import CreateTaskForm from './CreateTaskForm';
import { AlertIcon, InboxIcon } from './icons';
import Pagination from './Pagination';
import StatsBar from './StatsBar';
import TaskItem from './TaskItem';
import Toolbar from './Toolbar';

const SKELETON_ROWS = 6;

export default function TaskManager() {
  const [page, setPage] = usePersistedPage();
  const { tasks, total, status, addTask, toggleTask, renameTask, removeTask } = useTasks(page);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<TaskEntry | null>(null);

  const currentPage = page ?? 1;
  const totalPages = total !== null ? Math.max(1, Math.ceil(total / LIMIT)) : null;
  const hasNext =
    status === 'ready' && (totalPages !== null ? currentPage < totalPages : tasks.length >= LIMIT);
  const loading = status === 'loading';

  const visibleTasks = useMemo(() => tasks.filter((t) => !t.removing), [tasks]);
  const completedCount = visibleTasks.filter((t) => t.completed).length;
  const counts: Record<TaskFilter, number> = {
    all: visibleTasks.length,
    active: visibleTasks.length - completedCount,
    completed: completedCount,
  };

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        (filter === 'all' || (filter === 'completed') === t.completed) &&
        (!q || t.title.toLowerCase().includes(q)),
    );
  }, [tasks, filter, query]);

  const closeDialog = useCallback(() => setPendingDelete(null), []);
  const confirmDelete = useCallback(() => {
    if (pendingDelete) void removeTask(pendingDelete);
    setPendingDelete(null);
  }, [pendingDelete, removeTask]);

  return (
    <>
      <StatsBar total={total} onPage={visibleTasks.length} completed={completedCount} loading={loading} />

      <section className="panel">
        <div className="panel__head">
          <div>
            <h2>Мої завдання</h2>
            <p className="panel__sub">
              {totalPages ? `Сторінка ${currentPage} з ${totalPages}` : `Сторінка ${currentPage}`}
            </p>
          </div>
          <CreateTaskForm onCreate={addTask} />
        </div>

        <Toolbar filter={filter} onFilterChange={setFilter} query={query} onQueryChange={setQuery} counts={counts} />

        {loading && (
          <ul className="task-list" aria-busy="true" aria-label="Завантаження">
            {Array.from({ length: SKELETON_ROWS }, (_, i) => (
              <li key={i} className="task task--skeleton">
                <span className="skeleton skeleton--check" />
                <span className="skeleton skeleton--line" style={{ width: `${70 - (i % 3) * 15}%` }} />
              </li>
            ))}
          </ul>
        )}

        {status === 'error' && (
          <div className="empty empty--error">
            <AlertIcon />
            <p className="empty__title">Не вдалося завантажити завдання</p>
            <p>Перевірте з&apos;єднання та спробуйте іншу сторінку.</p>
          </div>
        )}

        {status === 'ready' && filteredTasks.length === 0 && (
          <div className="empty">
            <InboxIcon />
            <p className="empty__title">
              {tasks.length === 0 ? 'Немає завдань для відображення' : 'Нічого не знайдено'}
            </p>
            <p>{tasks.length === 0 ? 'Додайте перше завдання вище.' : 'Змініть фільтр або пошуковий запит.'}</p>
          </div>
        )}

        {status === 'ready' && filteredTasks.length > 0 && (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.key}
                task={task}
                onToggle={toggleTask}
                onRename={renameTask}
                onDelete={setPendingDelete}
              />
            ))}
          </ul>
        )}

        <div className="panel__foot">
          <p className="hint">Подвійний клік по назві — швидке редагування</p>
          <Pagination page={currentPage} totalPages={totalPages} hasNext={hasNext} onChange={setPage} />
        </div>
      </section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Видалити завдання?"
        description={pendingDelete ? `«${pendingDelete.title}» буде видалено без можливості відновлення.` : ''}
        confirmLabel="Видалити"
        onConfirm={confirmDelete}
        onCancel={closeDialog}
      />
    </>
  );
}
