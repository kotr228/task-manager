'use client';

import { useNotifications } from '@/hooks/useNotifications';

export default function Notifications() {
  const { notifications } = useNotifications();

  return (
    <>
      {notifications.map((n, index) => (
        <div
          key={n.id}
          className={`notification ${n.type}${n.visible ? ' show' : ''}`}
          style={{ top: 20 + index * 70 }}
          role={n.type === 'error' ? 'alert' : 'status'}
        >
          {n.message}
        </div>
      ))}
    </>
  );
}
