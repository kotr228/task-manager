import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Менеджер Завдань - Лабораторна робота №7',
  description: 'Веб-застосунок для управління завданнями з використанням HTTP-запитів та RESTful API',
  icons: { icon: '/logo.svg' },
};

export const viewport: Viewport = {
  themeColor: '#0B1120',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
