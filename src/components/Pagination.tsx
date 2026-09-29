'use client';

import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface Props {
  page: number;
  totalPages: number | null;
  hasNext: boolean;
  onChange: (page: number) => void;
}

/** Номери сторінок з трикрапками: 1 … 4 5 6 … 20 */
function pageNumbers(page: number, totalPages: number): (number | '…')[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev > 1) result.push('…');
    result.push(p);
  });
  return result;
}

export default function Pagination({ page, totalPages, hasNext, onChange }: Props) {
  return (
    <nav className="pagination" aria-label="Пагінація">
      <button
        type="button"
        className="page-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Попередня сторінка"
      >
        <ChevronLeftIcon />
      </button>

      {totalPages ? (
        pageNumbers(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className="page-gap">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`page-btn${p === page ? ' page-btn--active' : ''}`}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          ),
        )
      ) : (
        <span className="page-info">Сторінка {page}</span>
      )}

      <button
        type="button"
        className="page-btn"
        onClick={() => onChange(page + 1)}
        disabled={!hasNext}
        aria-label="Наступна сторінка"
      >
        <ChevronRightIcon />
      </button>
    </nav>
  );
}
