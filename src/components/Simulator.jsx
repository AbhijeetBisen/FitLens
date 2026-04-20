import { useState } from 'react';
import { calculateOneRepMax } from '../utils/strength.js';
import { formatNumber, roundTo } from '../utils/math.js';

export default function Simulator({ referenceWorkout }) {
  const [weight, setWeight] = useState(
    referenceWorkout ? String(referenceWorkout.weight) : '100',
  );
  const [reps, setReps] = useState(referenceWorkout ? String(referenceWorkout.reps) : '5');

  const parsedWeight = Number(weight);
  const parsedReps = Number(reps);
  const isValidWeight = Number.isFinite(parsedWeight) && parsedWeight > 0;
  const isValidReps = Number.isFinite(parsedReps) && parsedReps > 0;
  const projectedOneRm =
    isValidWeight && isValidReps ? calculateOneRepMax(parsedWeight, parsedReps) : 0;
  const referenceOneRm = referenceWorkout
    ? calculateOneRepMax(referenceWorkout.weight, referenceWorkout.reps)
    : 0;
  const impact = referenceOneRm > 0 ? roundTo(projectedOneRm - referenceOneRm, 1) : 0;
  const impactPercent =
    referenceOneRm > 0 ? roundTo((impact / referenceOneRm) * 100, 1) : 0;

  return (
    <section className="fitlens-card rounded-3xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">What-if simulator</h2>
          <p className="mt-1 text-sm text-slate-600">Change weight or reps to see the estimated 1RM instantly.</p>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          Explainable
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Weight</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            type="number"
            min="0"
            step="0.1"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Reps</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            type="number"
            min="0"
            step="1"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Projected 1RM</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{projectedOneRm ? formatNumber(projectedOneRm) : '—'}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Performance impact</p>
          {referenceOneRm > 0 ? (
            <>
              <p className={`mt-1 text-2xl font-semibold ${impact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {impact >= 0 ? '+' : ''}
                {formatNumber(impact)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {impact >= 0 ? 'above' : 'below'} your latest workout, about {Math.abs(impactPercent).toFixed(1)}%.
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-slate-600">Log a workout to compare this simulation against a real session.</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Based on the 1RM formula: weight × (1 + reps / 30).
      </p>
    </section>
  );
}
