'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Notification, NotificationType } from '@/types/task';

const SHOW_DELAY = 10;
const DISPLAY_TIME = 3000;
const HIDE_ANIMATION = 300;

type Notify = (message: string, type?: NotificationType) => void;

interface NotificationsContextValue {
  notifications: Notification[];
  notify: Notify;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const schedule = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      fn();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const notify = useCallback<Notify>(
    (message, type = 'success') => {
      const id = ++nextId.current;
      const setVisible = (visible: boolean) =>
        setNotifications((list) => list.map((n) => (n.id === id ? { ...n, visible } : n)));

      setNotifications((list) => [...list, { id, message, type, visible: false }]);
      schedule(() => setVisible(true), SHOW_DELAY);
      schedule(() => {
        setVisible(false);
        schedule(() => setNotifications((list) => list.filter((n) => n.id !== id)), HIDE_ANIMATION);
      }, DISPLAY_TIME);
    },
    [schedule],
  );

  return (
    <NotificationsContext.Provider value={{ notifications, notify }}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return ctx;
}
