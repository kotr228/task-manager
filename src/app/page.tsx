import Notifications from '@/components/Notifications';
import TaskManager from '@/components/TaskManager';
import { NotificationsProvider } from '@/hooks/useNotifications';

export default function HomePage() {
  return (
    <NotificationsProvider>
      <div className="container">
        <header>
          <h1>📋 Менеджер Завдань</h1>
          <p className="subtitle">Лабораторна робота №7: Використання HTTP-запитів</p>
        </header>

        <main>
          <TaskManager />
        </main>

        <footer>
          <p>
            API:{' '}
            <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer">
              JSONPlaceholder
            </a>
          </p>
          <p className="cache-info">Кешування активне | Fast Refresh підтримується</p>
        </footer>
      </div>
      <Notifications />
    </NotificationsProvider>
  );
}
