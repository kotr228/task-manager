/** Завдання у форматі JSONPlaceholder `/todos`. */
export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

/** Дані для створення нового завдання (id призначає сервер). */
export type NewTask = Omit<Task, 'id'>;

/** Часткове оновлення завдання (PATCH). */
export type TaskUpdate = Partial<Omit<Task, 'id'>>;

/** Сторінка завдань із загальною кількістю записів на сервері. */
export interface TasksPage {
  items: Task[];
  /** Загальна кількість завдань (`null`, якщо сервер її не повідомив). */
  total: number | null;
}

export type TaskFilter = 'all' | 'active' | 'completed';

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  visible: boolean;
}
