import Charts from './Charts.jsx';
import Insights from './Insights.jsx';
import Simulator from './Simulator.jsx';
import WorkoutForm from './WorkoutForm.jsx';
import { formatNumber, formatShortDate } from '../utils/math.js';

function NavLink({ href, label }) {
  return (
    <a
      href={href}
      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
    >
      {label}
    </a>
  );
}

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

export default function Dashboard({
  visibleWorkouts,
  allWorkouts,
  exerciseOptions,
  selectedExercise,
  onSelectExercise,
  onAddWorkout,
  onDeleteWorkout,
  onReset,
  onLoadDemoData,
  summary,
  fitnessScore,
  scoreBreakdown,
  insights,
}) {
  const latestWorkout = visibleWorkouts.at(-1) ?? null;
  const recentEntries = [...visibleWorkouts].reverse();
  const visibleWorkoutCount = recentEntries.length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-10 sm:px-6 lg:px-8">
      <nav className="sticky top-3 z-20 mb-6 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="px-2 text-sm font-semibold text-slate-800">FitLens navigation</p>
          <div className="flex flex-wrap gap-2">
            <NavLink href="#overview" label="Overview" />
            <NavLink href="#log-workout" label="Log workout" />
            <NavLink href="#analytics" label="Analytics" />
            <NavLink href="#insights" label="Insights" />
            <NavLink href="#history" label="History" />
            <NavLink href="#project-notes" label="Notes" />
          </div>
        </div>
      </nav>

      <section id="overview" className="relative isolate scroll-mt-24 overflow-hidden rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] sm:px-8 lg:px-10">
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
                {visibleWorkoutCount} visible
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
        <div className="space-y-6">
          <section id="log-workout" className="fitlens-card scroll-mt-24 rounded-3xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Log a workout</h2>
                <p className="mt-1 text-sm text-slate-600">Enter workout data once. FitLens saves it locally and turns it into metrics immediately.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="space-y-1 text-sm font-medium text-slate-700">
                  <span>Exercise filter</span>
                  <select
                    className="min-w-44 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    value={selectedExercise}
                    onChange={(event) => onSelectExercise(event.target.value)}
                  >
                    {exerciseOptions.map((exercise) => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:w-auto"
                  type="button"
                  onClick={onLoadDemoData}
                >
                  Load demo data
                </button>

                <button
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                  type="button"
                  onClick={onReset}
                >
                  Reset all
                </button>
              </div>
            </div>

            <WorkoutForm onSubmit={onAddWorkout} />
          </section>

          <section id="analytics" className="scroll-mt-24">
            <Charts workouts={visibleWorkouts} />
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <section id="insights" className="scroll-mt-24 space-y-6">
            <Insights
              workouts={visibleWorkouts}
              fitnessScore={fitnessScore}
              scoreBreakdown={scoreBreakdown}
              insights={insights}
              summary={summary}
            />

            <Simulator
              key={latestWorkout ? latestWorkout.id : 'empty'}
              referenceWorkout={latestWorkout}
            />
          </section>

          <section id="history" className="fitlens-card scroll-mt-24 rounded-3xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
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
        </div>
      </div>

      <section id="project-notes" className="fitlens-card mt-6 scroll-mt-24 rounded-3xl p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Project notes</h2>
            <p className="mt-1 text-sm text-slate-600">
              This section helps you present the project flow quickly in a viva or walkthrough.
            </p>
          </div>
          <a
            href="#overview"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            Back to top
          </a>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">What user does</p>
            <p className="mt-2 text-sm text-slate-700">Logs exercise, sets, reps, body weight, and optional sleep.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">What app calculates</p>
            <p className="mt-2 text-sm text-slate-700">1RM, volume, fitness score, trend direction, and next strength prediction.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">What user sees</p>
            <p className="mt-2 text-sm text-slate-700">Charts, streak, personal best, prediction panel, and actionable insights.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
