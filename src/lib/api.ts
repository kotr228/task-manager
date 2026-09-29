// Модуль для роботи з HTTP-запитами

import type { NewTask, Task, TaskUpdate } from '@/types/task';

export const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Кеш для зберігання даних
const cache = new Map<string, Task[]>();

// Опціональний токен авторизації
let token: string | null = null;

/** Помилка HTTP-запиту з кодом статусу. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
  ) {
    super(`HTTP Error: ${status} ${statusText}`);
    this.name = 'HttpError';
  }
}

/** Встановити токен авторизації. */
export function setAuthToken(newToken: string | null): void {
  token = newToken;
}

/** Перевірити відповідь на помилки. */
function checkResponse(response: Response): Response {
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }
  return response;
}

/** Отримати базові заголовки для запитів. */
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/** Отримати завдання з пагінацією. */
export async function getTasks(page = 1, limit = 10): Promise<Task[]> {
  const cacheKey = `tasks_${page}_${limit}`;

  // Перевіряємо кеш
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log('Returning from cache:', cacheKey);
    return cached;
  }

  const url = `${API_URL}?_page=${page}&_limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    checkResponse(response);
    const tasks = (await response.json()) as Task[];

    // Зберігаємо в кеш
    cache.set(cacheKey, tasks);

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/** Створити нове завдання. */
export async function createTask(task: NewTask): Promise<Task> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(task),
    });

    checkResponse(response);
    const newTask = (await response.json()) as Task;

    // Очищаємо кеш після створення
    cache.clear();

    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/** Оновити завдання (часткове оновлення). */
export async function updateTask(id: number, updates: TaskUpdate): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    checkResponse(response);
    const updatedTask = (await response.json()) as Task;

    // Очищаємо кеш після оновлення
    cache.clear();

    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

/** Видалити завдання. */
export async function deleteTask(id: number): Promise<true> {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    checkResponse(response);

    // Очищаємо кеш після видалення
    cache.clear();

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/** Групове оновлення завдань. */
export async function bulkUpdate(ids: number[], updates: TaskUpdate): Promise<Task[]> {
  try {
    return await Promise.all(ids.map((id) => updateTask(id, updates)));
  } catch (error) {
    console.error('Error in bulk update:', error);
    throw new Error(`Bulk update failed: ${getErrorMessage(error)}`);
  }
}

/** Очистити кеш. */
export function clearCache(): void {
  cache.clear();
  console.log('Cache cleared');
}

/** Отримати розмір кешу. */
export function getCacheSize(): number {
  return cache.size;
}

/** Безпечно отримати текст помилки з unknown. */
export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
