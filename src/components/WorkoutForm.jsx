import { useState } from 'react';

function parsePositiveNumber(rawValue, label, allowBlank = false) {
  const trimmedValue = rawValue.trim();

  if (allowBlank && trimmedValue === '') {
    return null;
  }

  const numericValue = Number(trimmedValue);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(`${label} must be a valid non-negative number.`);
  }

  return numericValue;
}

export default function WorkoutForm({ onSubmit }) {
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [bodyWeight, setBodyWeight] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    try {
      const trimmedExercise = exerciseName.trim();

      if (!trimmedExercise) {
        throw new Error('Exercise name is required.');
      }

      const parsedWeight = parsePositiveNumber(weight, 'Weight');
      const parsedReps = parsePositiveNumber(reps, 'Reps');
      const parsedSets = parsePositiveNumber(sets, 'Sets');
      const parsedBodyWeight = parsePositiveNumber(bodyWeight, 'Body weight');
      const parsedSleepHours = parsePositiveNumber(sleepHours, 'Sleep hours', true);

      if (parsedWeight === 0 || parsedReps === 0 || parsedSets === 0 || parsedBodyWeight === 0) {
        throw new Error('Weight, reps, sets, and body weight must be greater than zero.');
      }

      onSubmit({
        exerciseName: trimmedExercise,
        weight: parsedWeight,
        reps: parsedReps,
        sets: parsedSets,
        bodyWeight: parsedBodyWeight,
        sleepHours: parsedSleepHours,
      });

      setExerciseName('');
      setWeight('');
      setReps('');
      setSets('');
      setBodyWeight('');
      setSleepHours('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      {errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Exercise name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            placeholder="Bench Press"
            value={exerciseName}
            onChange={(event) => {
              setExerciseName(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Weight lifted</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="number"
            min="0"
            step="0.1"
            placeholder="100"
            value={weight}
            onChange={(event) => {
              setWeight(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Reps</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="number"
            min="0"
            step="1"
            placeholder="8"
            value={reps}
            onChange={(event) => {
              setReps(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Sets</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="number"
            min="0"
            step="1"
            placeholder="3"
            value={sets}
            onChange={(event) => {
              setSets(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Body weight</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="number"
            min="0"
            step="0.1"
            placeholder="72.5"
            value={bodyWeight}
            onChange={(event) => {
              setBodyWeight(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Sleep hours</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            type="number"
            min="0"
            step="0.1"
            placeholder="Optional"
            value={sleepHours}
            onChange={(event) => {
              setSleepHours(event.target.value);
              setErrorMessage('');
            }}
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">All entries are converted to numbers and stored locally in your browser.</p>
        <button
          className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="submit"
        >
          Save workout
        </button>
      </div>
    </form>
  );
}
