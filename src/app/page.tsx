import Image from 'next/image';
import Notifications from '@/components/Notifications';
import TaskManager from '@/components/TaskManager';
import { NotificationsProvider } from '@/hooks/useNotifications';

export default function HomePage() {
  return (
    <NotificationsProvider>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <Image src="/logo.svg" alt="" width={40} height={40} priority />
            <div>
              <p className="brand__name">Менеджер Завдань</p>
              <p className="brand__tag">Лабораторна робота №7</p>
            </div>
          </div>
          <div className="topbar__chips">
            <span className="pill">Next.js</span>
            <span className="pill">TypeScript</span>
            <span className="pill pill--live">
              <span className="dot" /> REST API
            </span>
          </div>
        </header>

        <main className="shell">
          <section className="hero">
            <p className="eyebrow">Використання HTTP-запитів</p>
            <h1>
              Плануйте. Виконуйте. <span className="gradient-text">Завершуйте.</span>
            </h1>
            <p className="hero__lead">
              Повний цикл CRUD через Fetch API: GET із пагінацією та кешуванням, POST, PATCH і DELETE до
              RESTful API JSONPlaceholder.
            </p>
          </section>

          <TaskManager />
        </main>

        <footer className="footer">
          <p>
            Дані:{' '}
            <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer">
              JSONPlaceholder
            </a>{' '}
            · зміни не зберігаються на сервері
          </p>
          <p className="footer__muted">Кешування запитів · LocalStorage · Fast Refresh</p>
        </footer>
      </div>
      <Notifications />
    </NotificationsProvider>
  );
}
