const oneDecimalFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
});

export function safeNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

export function roundTo(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(safeNumber(value) * factor) / factor;
}

export function clamp(value, minimum, maximum) {
  return Math.min(Math.max(safeNumber(value), minimum), maximum);
}

export function average(values) {
  const validValues = values.filter(Number.isFinite);
  if (!validValues.length) {
    return 0;
  }

  const total = validValues.reduce((sum, value) => sum + value, 0);
  return total / validValues.length;
}

export function percentChange(previousValue, nextValue) {
  const previous = safeNumber(previousValue);
  const next = safeNumber(nextValue);

  if (previous === 0) {
    return 0;
  }

  return ((next - previous) / Math.abs(previous)) * 100;
}

export function sameCalendarMonth(firstDate, secondDate) {
  const first = new Date(firstDate);
  const second = new Date(secondDate);

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth()
  );
}

export function daysSince(dateValue, referenceDate = new Date()) {
  const date = new Date(dateValue);
  const difference = referenceDate.getTime() - date.getTime();
  return Math.floor(difference / 86400000);
}

export function uniqueWorkoutDays(workouts) {
  return new Set(
    workouts.map((workout) => new Date(workout.date).toDateString()),
  ).size;
}

export function formatNumber(value) {
  return oneDecimalFormatter.format(safeNumber(value));
}

export function formatShortDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateValue));
}
