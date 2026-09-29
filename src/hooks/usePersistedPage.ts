'use client';

import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'currentPage';

/** Зберегти номер сторінки у localStorage. */
function savePageToLocalStorage(page: number): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(page));
  } catch {
    // localStorage може бути недоступним (приватний режим тощо)
  }
}

/** Відновити номер сторінки з localStorage. */
function restorePageFromLocalStorage(): number {
  try {
    const saved = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '', 10);
    return Number.isInteger(saved) && saved > 0 ? saved : 1;
  } catch {
    return 1;
  }
}

/**
 * Номер поточної сторінки, що зберігається між сесіями.
 * До відновлення з localStorage (лише на клієнті) повертає `null`.
 */
export function usePersistedPage(): [number | null, (page: number) => void] {
  const [page, setPageState] = useState<number | null>(null);

  useEffect(() => {
    setPageState(restorePageFromLocalStorage());
  }, []);

  const setPage = useCallback((next: number) => {
    const safe = Math.max(1, next);
    setPageState(safe);
    savePageToLocalStorage(safe);
  }, []);

  return [page, setPage];
}
