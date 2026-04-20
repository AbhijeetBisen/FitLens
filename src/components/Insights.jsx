import { formatNumber } from '../utils/math.js';

function ScoreBar({ label, value, tone }) {
  const barColor =
    tone === 'success'
      ? 'bg-emerald-500'
      : tone === 'warning'
        ? 'bg-amber-500'
        : tone === 'info'
          ? 'bg-sky-500'
          : 'bg-slate-500';

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span className="font-semibold text-slate-900">{formatNumber(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
      </div>
    </div>
  );
}

export default function Insights({
  workouts,
  fitnessScore,
  scoreBreakdown,
  insights,
  summary,
}) {
  if (!workouts.length) {
    return (
      <section className="fitlens-card rounded-3xl p-5">
        <h2 className="text-xl font-semibold text-slate-900">Insights</h2>
        <p className="mt-2 text-sm text-slate-600">
          Log a few workouts before the score and insights become meaningful.
        </p>
      </section>
    );
  }

  return (
    <section className="fitlens-card rounded-3xl p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Insights</h2>
          <p className="mt-1 text-sm text-slate-600">A simple, explainable summary of the filtered workout data.</p>
        </div>
        {summary.isNewPersonalBest ? (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            New Personal Best 🎉
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Keep pushing
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">Fitness score</p>
          <p className="mt-2 text-4xl font-semibold text-slate-900">{formatNumber(fitnessScore)}</p>
          <p className="mt-2 text-sm text-slate-600">A weighted mix of training, sleep, consistency, and progress.</p>
        </div>

        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5">
          <ScoreBar label="Workout" value={scoreBreakdown.workout} tone="success" />
          <ScoreBar label="Sleep" value={scoreBreakdown.sleep} tone="info" />
          <ScoreBar label="Consistency" value={scoreBreakdown.consistency} tone="warning" />
          <ScoreBar label="Progress" value={scoreBreakdown.progress} tone="success" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Trend direction</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{summary.trendDirection}</p>
          <p className="mt-1 text-sm text-slate-600">{summary.predictionExplanation}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Streak</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{summary.streakDays} day{summary.streakDays === 1 ? '' : 's'}</p>
          <p className="mt-1 text-sm text-slate-600">{summary.progressSummary}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <article key={insight.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-slate-900">{insight.title}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {insight.tone}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{insight.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
