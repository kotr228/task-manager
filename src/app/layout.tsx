import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Менеджер Завдань - Лабораторна робота №7',
  description: 'Веб-застосунок для управління завданнями з використанням HTTP-запитів та RESTful API',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
