'use client';

import type { TaskFilter } from '@/types/task';
import { SearchIcon } from './icons';

interface Props {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  query: string;
  onQueryChange: (query: string) => void;
  counts: Record<TaskFilter, number>;
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Активні' },
  { value: 'completed', label: 'Виконані' },
];

export default function Toolbar({ filter, onFilterChange, query, onQueryChange, counts }: Props) {
  return (
    <div className="toolbar">
      <div className="tabs" role="tablist" aria-label="Фільтр завдань">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`tab${filter === value ? ' tab--active' : ''}`}
            onClick={() => onFilterChange(value)}
          >
            {label}
            <span className="tab__count">{counts[value]}</span>
          </button>
        ))}
      </div>
      <label className="search">
        <SearchIcon />
        <span className="sr-only">Пошук завдань</span>
        <input
          type="search"
          placeholder="Пошук на сторінці…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </label>
    </div>
  );
}
