import { formatNumber } from '../utils/math.js';

function StatCard({ label, value, hint, accent = 'emerald' }) {
  const accentClass =
    accent === 'amber'
      ? 'text-amber-200'
      : accent === 'sky'
        ? 'text-sky-200'
        : accent === 'violet'
          ? 'text-violet-200'
          : 'text-emerald-200';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
      <p className="text-sm text-slate-300">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accentClass}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-300">{hint}</p>
    </div>
  );
}

export default function OverviewPage({ summary, selectedExercise, allWorkouts }) {
  return (
    <section className="relative isolate overflow-hidden rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-12 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
        <div className="space-y-4">
          <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200">
            FitLens
          </span>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Track your workouts, see your progress, and stay motivated.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Log your training, watch your numbers improve, and get simple helpful feedback along the way. Everything stays in your browser.
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Workout tracking</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Progress charts</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Strength prediction</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Simple insights</span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/8 p-5 text-sm text-slate-300 backdrop-blur-sm shadow-[0_20px_50px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current filter</p>
              <p className="mt-2 text-lg font-semibold text-white">{selectedExercise}</p>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              {summary.workoutCount} visible
            </span>
          </div>

          <p className="mt-4 max-w-sm leading-relaxed">{summary.progressSummary}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Best 1RM</p>
              <p className="mt-1 text-lg font-semibold text-white">{formatNumber(summary.bestOneRm)}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Trend</p>
              <p className="mt-1 text-lg font-semibold text-white">{summary.trendDirection}</p>
            </div>
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-emerald-200">
            {allWorkouts.length ? 'Sample data included' : 'Start with sample workouts'}
          </p>
        </div>
      </div>

      <div className="relative mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Workouts logged"
          value={summary.workoutCount}
          hint="Visible in the current filter"
          accent="emerald"
        />
        <StatCard
          label="Best 1RM"
          value={formatNumber(summary.bestOneRm)}
          hint={summary.isNewPersonalBest ? 'New Personal Best 🎉' : 'Best session in the current view'}
          accent="amber"
        />
        <StatCard
          label="Next predicted strength"
          value={formatNumber(summary.nextPredictedStrength)}
          hint={`Trend is ${summary.trendDirection}`}
          accent="sky"
        />
        <StatCard
          label="Streak"
          value={`${summary.streakDays} day${summary.streakDays === 1 ? '' : 's'}`}
          hint="Consecutive workout days"
          accent="violet"
        />
      </div>
    </section>
  );
}
