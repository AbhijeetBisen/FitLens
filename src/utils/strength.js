import { roundTo, safeNumber } from './math.js';

export function calculateOneRepMax(weight, reps) {
  const safeWeight = safeNumber(weight);
  const safeReps = safeNumber(reps);
  return roundTo(safeWeight * (1 + safeReps / 30), 1);
}

export function calculateVolume(weight, reps, sets) {
  const safeWeight = safeNumber(weight);
  const safeReps = safeNumber(reps);
  const safeSets = safeNumber(sets);
  return roundTo(safeWeight * safeReps * safeSets, 1);
}
