import { formatNumber, formatShortDate } from '../utils/math.js';

export default function HistoryPage({ recentEntries, onDeleteWorkout, onReset }) {
  return (
    <section className="fitlens-card rounded-3xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Workout history</h2>
          <p className="mt-1 text-sm text-slate-600">
            Latest workouts first. The list stays scrollable so the page does not keep stretching.
          </p>
        </div>
        <button
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          type="button"
          onClick={onReset}
        >
          Reset all data
        </button>
      </div>

      {recentEntries.length ? (
        <div className="mt-4 max-h-128 space-y-3 overflow-y-auto pr-1">
          {recentEntries.map((workout) => (
            <article key={workout.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition hover:border-emerald-200 hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{workout.exerciseName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatShortDate(workout.date)} · Session {workout.sessionNumber}
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:text-rose-700"
                  type="button"
                  onClick={() => onDeleteWorkout(workout.id)}
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl bg-white px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">1RM</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(workout.oneRm)}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Volume</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(workout.volume)}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Body weight</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{formatNumber(workout.bodyWeight)}</p>
                </div>
                <div className="rounded-2xl bg-white px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Sleep</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {workout.sleepHours == null ? '—' : `${formatNumber(workout.sleepHours)} h`}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          Start by logging your first workout.
        </div>
      )}
    </section>
  );
}
