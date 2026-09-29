'use client';

interface Props {
  page: number;
  hasNext: boolean;
  onChange: (page: number) => void;
}

export default function Pagination({ page, hasNext, onChange }: Props) {
  return (
    <div className="pagination-controls">
      <button
        type="button"
        id="btn-prev"
        className="btn btn-secondary"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        ⬅️ Назад
      </button>
      <span id="page-info" className="page-info">
        Сторінка {page}
      </span>
      <button
        type="button"
        id="btn-next"
        className="btn btn-secondary"
        onClick={() => onChange(page + 1)}
        disabled={!hasNext}
      >
        Вперед ➡️
      </button>
    </div>
  );
}
