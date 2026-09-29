'use client';

import { useNotifications } from '@/hooks/useNotifications';
import { AlertIcon, CheckIcon, InfoIcon } from './icons';

const ICONS = { success: CheckIcon, error: AlertIcon, info: InfoIcon };

export default function Notifications() {
  const { notifications } = useNotifications();

  return (
    <div className="toasts" aria-live="polite">
      {notifications.map((n) => {
        const Icon = ICONS[n.type];
        return (
          <div
            key={n.id}
            className={`toast toast--${n.type}${n.visible ? ' toast--show' : ''}`}
            role={n.type === 'error' ? 'alert' : 'status'}
          >
            <span className="toast__icon">
              <Icon />
            </span>
            {n.message}
          </div>
        );
      })}
    </div>
  );
}
