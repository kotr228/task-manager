'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createTask, deleteTask, getErrorMessage, getTasks, updateTask } from '@/lib/api';
import type { Task } from '@/types/task';
import { useNotifications } from './useNotifications';

export const LIMIT = 10;
const REMOVE_ANIMATION = 300;

/** Завдання разом зі стабільним ключем для React. */
export interface TaskEntry extends Task {
  /**
   * JSONPlaceholder повертає однаковий id (201) для кожного створеного завдання,
   * тому для рендерингу використовуємо окремий унікальний ключ.
   */
  key: string;
  removing?: boolean;
}

export type LoadStatus = 'loading' | 'ready' | 'error';

let localKeyCounter = 0;
const toEntry = (task: Task, isNew = false): TaskEntry => ({
  ...task,
  key: isNew ? `new-${++localKeyCounter}` : `task-${task.id}`,
});

export function useTasks(page: number | null) {
  const { notify } = useNotifications();
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const requestId = useRef(0);

  // Завантаження завдань при зміні сторінки
  useEffect(() => {
    if (page === null) return;

    const current = ++requestId.current;
    setStatus('loading');

    getTasks(page, LIMIT)
      .then((data) => {
        if (current !== requestId.current) return; // застаріла відповідь
        setTasks(data.map((task) => toEntry(task)));
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (current !== requestId.current) return;
        notify(`Помилка завантаження: ${getErrorMessage(error)}`, 'error');
        setStatus('error');
      });
  }, [page, notify]);

  const patchEntry = useCallback((key: string, patch: Partial<TaskEntry>) => {
    setTasks((list) => list.map((t) => (t.key === key ? { ...t, ...patch } : t)));
  }, []);

  const addTask = useCallback(
    async (title: string): Promise<boolean> => {
      try {
        const newTask = await createTask({ title, completed: false, userId: 1 });
        setTasks((list) => [toEntry(newTask, true), ...list]);
        notify('Завдання створено!');
        return true;
      } catch (error) {
        notify(`Помилка створення: ${getErrorMessage(error)}`, 'error');
        return false;
      }
    },
    [notify],
  );

  const toggleTask = useCallback(
    async (entry: TaskEntry, completed: boolean) => {
      patchEntry(entry.key, { completed }); // оптимістичне оновлення
      try {
        await updateTask(entry.id, { completed });
        notify('Статус оновлено!');
      } catch (error) {
        patchEntry(entry.key, { completed: !completed }); // повертаємо попередній стан
        notify(`Помилка оновлення: ${getErrorMessage(error)}`, 'error');
      }
    },
    [notify, patchEntry],
  );

  const renameTask = useCallback(
    async (entry: TaskEntry, title: string) => {
      try {
        await updateTask(entry.id, { title });
        patchEntry(entry.key, { title });
        notify('Завдання оновлено!');
      } catch (error) {
        notify(`Помилка оновлення: ${getErrorMessage(error)}`, 'error');
      }
    },
    [notify, patchEntry],
  );

  const removeTask = useCallback(
    async (entry: TaskEntry) => {
      try {
        await deleteTask(entry.id);
        patchEntry(entry.key, { removing: true });
        setTimeout(() => setTasks((list) => list.filter((t) => t.key !== entry.key)), REMOVE_ANIMATION);
        notify('Завдання видалено!');
      } catch (error) {
        notify(`Помилка видалення: ${getErrorMessage(error)}`, 'error');
      }
    },
    [notify, patchEntry],
  );

  return { tasks, status, addTask, toggleTask, renameTask, removeTask };
}
