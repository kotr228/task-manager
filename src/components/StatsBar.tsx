import { CheckIcon, ClockIcon, DatabaseIcon, ListIcon } from './icons';

interface Props {
  total: number | null;
  onPage: number;
  completed: number;
  loading: boolean;
}

export default function StatsBar({ total, onPage, completed, loading }: Props) {
  const active = onPage - completed;
  const progress = onPage > 0 ? Math.round((completed / onPage) * 100) : 0;
  const value = (n: number | null) => (loading || n === null ? '—' : n);

  return (
    <section className="stats" aria-label="Статистика">
      <div className="stat-card">
        <span className="stat-icon stat-icon--indigo">
          <DatabaseIcon />
        </span>
        <div>
          <p className="stat-label">Всього в API</p>
          <p className="stat-value">{value(total)}</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon stat-icon--slate">
          <ListIcon />
        </span>
        <div>
          <p className="stat-label">На сторінці</p>
          <p className="stat-value">{value(onPage)}</p>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon stat-icon--amber">
          <ClockIcon />
        </span>
        <div>
          <p className="stat-label">В роботі</p>
          <p className="stat-value">{value(active)}</p>
        </div>
      </div>
      <div className="stat-card stat-card--progress">
        <span className="stat-icon stat-icon--mint">
          <CheckIcon />
        </span>
        <div className="stat-progress">
          <p className="stat-label">
            Виконано <strong>{loading ? '—' : `${completed} · ${progress}%`}</strong>
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={loading ? 0 : progress}
            aria-label="Прогрес виконання на сторінці"
          >
            <div className="progress-bar" style={{ width: `${loading ? 0 : progress}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
