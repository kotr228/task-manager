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

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
  visible: boolean;
}
