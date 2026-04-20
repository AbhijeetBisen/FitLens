import WorkoutForm from '../components/WorkoutForm.jsx';

export default function LogWorkoutPage({
  exerciseOptions,
  selectedExercise,
  onSelectExercise,
  onLoadDemoData,
  onReset,
  onAddWorkout,
}) {
  return (
    <section className="fitlens-card rounded-3xl p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
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
  );
}
