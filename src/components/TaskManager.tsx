'use client';

import { usePersistedPage } from '@/hooks/usePersistedPage';
import { LIMIT, useTasks } from '@/hooks/useTasks';
import CreateTaskForm from './CreateTaskForm';
import Pagination from './Pagination';
import TaskItem from './TaskItem';

export default function TaskManager() {
  const [page, setPage] = usePersistedPage();
  const { tasks, status, addTask, toggleTask, renameTask, removeTask } = useTasks(page);

  const currentPage = page ?? 1;
  // Якщо сторінка неповна — далі завдань немає
  const hasNext = status === 'ready' && tasks.length >= LIMIT;

  return (
    <>
      <CreateTaskForm onCreate={addTask} />

      <section className="tasks-section">
        <div className="section-header">
          <h2>Мої завдання</h2>
          <Pagination page={currentPage} hasNext={hasNext} onChange={setPage} />
        </div>
        <div id="tasks-container">
          {status === 'loading' && <div className="loading">⏳ Завантаження...</div>}
          {status === 'error' && <p className="error-message">Не вдалося завантажити завдання</p>}
          {status === 'ready' && tasks.length === 0 && (
            <p className="empty-message">Немає завдань для відображення</p>
          )}
          {status === 'ready' &&
            tasks.map((task) => (
              <TaskItem
                key={task.key}
                task={task}
                onToggle={toggleTask}
                onRename={renameTask}
                onDelete={removeTask}
              />
            ))}
        </div>
      </section>
    </>
  );
}
