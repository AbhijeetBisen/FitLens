import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout.jsx';
import { calculateOneRepMax, calculateVolume } from './utils/strength.js';
import {
  average,
  clamp,
  daysSince,
  percentChange,
  roundTo,
  sameCalendarMonth,
  safeNumber,
  uniqueWorkoutDays,
} from './utils/math.js';
import { linearRegression, predict } from './utils/regression.js';
import OverviewPage from './pages/OverviewPage.jsx';
import LogWorkoutPage from './pages/LogWorkoutPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

const STORAGE_KEY = 'fitlens-workouts';
const DEMO_FLAG_KEY = 'fitlens-demo-initialized';

const DEMO_WORKOUTS = [
  {
    id: 'demo-1',
    exerciseName: 'Bench Press',
    weight: 70,
    reps: 8,
    sets: 3,
    bodyWeight: 71.5,
    sleepHours: 7.2,
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    exerciseName: 'Bench Press',
    weight: 72.5,
    reps: 8,
    sets: 3,
    bodyWeight: 71.8,
    sleepHours: 7.5,
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'demo-3',
    exerciseName: 'Bench Press',
    weight: 75,
    reps: 7,
    sets: 3,
    bodyWeight: 72.1,
    sleepHours: 6.8,
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'demo-4',
    exerciseName: 'Squat',
    weight: 100,
    reps: 5,
    sets: 4,
    bodyWeight: 72.6,
    sleepHours: 7.1,
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'demo-5',
    exerciseName: 'Deadlift',
    weight: 120,
    reps: 5,
    sets: 3,
    bodyWeight: 72.9,
    sleepHours: 7.4,
    date: new Date().toISOString(),
  },
];

function createWorkoutId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isValidWorkout(workout) {
  return (
    workout &&
    typeof workout.exerciseName === 'string' &&
    workout.exerciseName.trim().length > 0 &&
    safeNumber(workout.weight) > 0 &&
    safeNumber(workout.reps) > 0 &&
    safeNumber(workout.sets) > 0 &&
    safeNumber(workout.bodyWeight) > 0
  );
}

function normalizeStoredWorkout(workout) {
  const sleepHoursValue = workout.sleepHours;

  return {
    id: typeof workout.id === 'string' ? workout.id : createWorkoutId(),
    exerciseName: String(workout.exerciseName ?? '').trim(),
    weight: safeNumber(workout.weight),
    reps: safeNumber(workout.reps),
    sets: safeNumber(workout.sets),
    bodyWeight: safeNumber(workout.bodyWeight),
    sleepHours:
      sleepHoursValue === null || sleepHoursValue === undefined || sleepHoursValue === ''
        ? null
        : safeNumber(sleepHoursValue),
    date:
      typeof workout.date === 'string' && workout.date
        ? workout.date
        : new Date().toISOString(),
  };
}

function loadWorkouts() {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    const demoInitialized = window.localStorage.getItem(DEMO_FLAG_KEY) === 'true';
    if (!demoInitialized) {
      return DEMO_WORKOUTS;
    }

    return [];
  }

  try {
    const parsedValue = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(normalizeStoredWorkout)
      .filter(isValidWorkout)
      .sort((firstWorkout, secondWorkout) => new Date(firstWorkout.date) - new Date(secondWorkout.date));
  } catch {
    return [];
  }
}

function sortWorkouts(workouts) {
  return [...workouts].sort(
    (firstWorkout, secondWorkout) => new Date(firstWorkout.date) - new Date(secondWorkout.date),
  );
}

function enrichWorkouts(workouts) {
  return sortWorkouts(workouts).map((workout, index) => ({
    ...workout,
    sessionNumber: index + 1,
    oneRm: calculateOneRepMax(workout.weight, workout.reps),
    volume: calculateVolume(workout.weight, workout.reps, workout.sets),
  }));
}

function calculateStreak(workouts) {
  if (!workouts.length) {
    return 0;
  }

  const workoutDates = new Set(
    workouts.map((workout) => new Date(workout.date).toDateString()),
  );

  const cursorDate = new Date(workouts[workouts.length - 1].date);
  let streak = 0;

  while (workoutDates.has(cursorDate.toDateString())) {
    streak += 1;
    cursorDate.setDate(cursorDate.getDate() - 1);
  }

  return streak;
}

function calculateProgressSummary(workouts) {
  if (workouts.length < 2) {
    return {
      message: 'Log at least two workouts to measure progress.',
      percent: 0,
    };
  }

  const currentMonth = new Date();
  const monthlyWorkouts = workouts.filter((workout) =>
    sameCalendarMonth(workout.date, currentMonth),
  );

  if (monthlyWorkouts.length >= 2) {
    const change = percentChange(
      monthlyWorkouts[0].oneRm,
      monthlyWorkouts[monthlyWorkouts.length - 1].oneRm,
    );

    return {
      message: `You improved ${Math.abs(change).toFixed(1)}% this month.`,
      percent: change,
    };
  }

  const overallChange = percentChange(workouts[0].oneRm, workouts[workouts.length - 1].oneRm);
  return {
    message: `You improved ${Math.abs(overallChange).toFixed(1)}% since your first session.`,
    percent: overallChange,
  };
}

function calculateFitnessScore(workouts) {
  if (!workouts.length) {
    return {
      score: 0,
      breakdown: {
        workout: 0,
        sleep: 0,
        consistency: 0,
        progress: 0,
      },
    };
  }

  const recentSevenDays = workouts.filter((workout) => daysSince(workout.date) <= 7);
  const recentFourteenDays = workouts.filter((workout) => daysSince(workout.date) <= 14);
  const sleepValues = workouts
    .map((workout) => workout.sleepHours)
    .filter((sleepHours) => Number.isFinite(sleepHours) && sleepHours > 0);
  const averageSleep = sleepValues.length ? average(sleepValues) : 0;
  const progressPercent = percentChange(workouts[0].oneRm, workouts[workouts.length - 1].oneRm);

  const workoutScore = clamp((recentSevenDays.length / 4) * 100, 0, 100);
  const sleepScore = averageSleep ? clamp((averageSleep / 8) * 100, 0, 100) : 0;
  const consistencyScore = clamp((uniqueWorkoutDays(recentFourteenDays) / 7) * 100, 0, 100);
  const progressScore = clamp(50 + progressPercent * 4, 0, 100);

  const score = roundTo(
    workoutScore * 0.4 + sleepScore * 0.2 + consistencyScore * 0.2 + progressScore * 0.2,
    1,
  );

  return {
    score,
    breakdown: {
      workout: roundTo(workoutScore, 1),
      sleep: roundTo(sleepScore, 1),
      consistency: roundTo(consistencyScore, 1),
      progress: roundTo(progressScore, 1),
    },
  };
}

function buildInsights(workouts) {
  if (!workouts.length) {
    return [
      {
        title: 'Start by logging your first workout',
        detail: 'The charting and prediction layers will light up after the first saved session.',
        tone: 'neutral',
      },
    ];
  }

  const sleepValues = workouts
    .map((workout) => workout.sleepHours)
    .filter((sleepHours) => Number.isFinite(sleepHours) && sleepHours > 0);
  const averageSleep = sleepValues.length ? average(sleepValues) : 0;
  const regressionPoints = workouts.map((workout, index) => ({
    x: index + 1,
    y: workout.oneRm,
  }));
  const regression = linearRegression(regressionPoints);
  const latestThree = workouts.slice(-3);
  const previousThree = workouts.slice(-6, -3);
  const latestThreeStrength = average(latestThree.map((workout) => workout.oneRm));
  const previousThreeStrength = average(previousThree.map((workout) => workout.oneRm));
  const latestThreeVolume = average(latestThree.map((workout) => workout.volume));
  const previousThreeVolume = average(previousThree.map((workout) => workout.volume));
  const volumeRising = previousThree.length >= 2 && latestThreeVolume > previousThreeVolume * 1.05;
  const strengthFlat =
    previousThree.length >= 2 &&
    Math.abs(latestThreeStrength - previousThreeStrength) /
      Math.max(previousThreeStrength, 1) <
      0.03;
  const progressPercent = percentChange(workouts[0].oneRm, workouts[workouts.length - 1].oneRm);
  const streakDays = calculateStreak(workouts);
  const bodyWeightChange = percentChange(workouts[0].bodyWeight, workouts[workouts.length - 1].bodyWeight);

  const insights = [];

  if (regression.slope > 0.5 && progressPercent > 1) {
    insights.push({
      title: 'Strength improving steadily',
      detail: `The regression line is rising by ${formatSlope(regression.slope)} 1RM points per session, and the filtered data is up ${Math.abs(progressPercent).toFixed(1)}%.`,
      tone: 'success',
    });
  } else if (regression.slope > 0.1 && progressPercent <= 1) {
    insights.push({
      title: 'Progress is slowing down',
      detail: 'The line is still positive, but the recent change is smaller than earlier sessions.',
      tone: 'warning',
    });
  }

  if (averageSleep > 0 && averageSleep < 7) {
    insights.push({
      title: 'Low sleep may affect recovery',
      detail: `Average sleep is ${roundTo(averageSleep, 1).toFixed(1)} hours, which is below the usual recovery range.`,
      tone: 'warning',
    });
  }

  if (volumeRising && strengthFlat) {
    insights.push({
      title: 'Volume is increasing but strength is flat',
      detail: 'You are doing more total work, but the current 1RM trend is not responding yet.',
      tone: 'info',
    });
  }

  if (bodyWeightChange > 0 && regression.slope > 0.1) {
    insights.push({
      title: 'Body weight and strength are moving together',
      detail: 'A small upward body weight trend is lining up with a positive strength trend.',
      tone: 'success',
    });
  }

  if (streakDays >= 3) {
    insights.push({
      title: `${streakDays}-day streak`,
      detail: 'Consistency is strong. Keep the routine steady so the trend line stays readable.',
      tone: 'success',
    });
  }

  if (insights.length === 0) {
    insights.push({
      title: 'Keep logging workouts',
      detail: 'More sessions will make the trend and prediction more reliable.',
      tone: 'neutral',
    });
  }

  return insights.slice(0, 4);
}

function formatSlope(value) {
  const formatted = Math.abs(roundTo(value, 1)).toFixed(1);
  return value < 0 ? `-${formatted}` : formatted;
}

export default function App() {
  const [workouts, setWorkouts] = useState(loadWorkouts);
  const [selectedExercise, setSelectedExercise] = useState('All exercises');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
    if (workouts.length > 0 && window.localStorage.getItem(DEMO_FLAG_KEY) !== 'true') {
      window.localStorage.setItem(DEMO_FLAG_KEY, 'true');
    }
  }, [workouts]);

  const exerciseOptions = useMemo(() => {
    const uniqueExercises = [...new Set(workouts.map((workout) => workout.exerciseName))].sort();
    return ['All exercises', ...uniqueExercises];
  }, [workouts]);

  useEffect(() => {
    if (selectedExercise !== 'All exercises' && !exerciseOptions.includes(selectedExercise)) {
      setSelectedExercise('All exercises');
    }
  }, [exerciseOptions, selectedExercise]);

  const visibleWorkouts = useMemo(() => {
    const filteredWorkouts =
      selectedExercise === 'All exercises'
        ? workouts
        : workouts.filter((workout) => workout.exerciseName === selectedExercise);

    return enrichWorkouts(filteredWorkouts);
  }, [selectedExercise, workouts]);

  const regressionPoints = useMemo(
    () => visibleWorkouts.map((workout, index) => ({ x: index + 1, y: workout.oneRm })),
    [visibleWorkouts],
  );

  const regression = useMemo(() => linearRegression(regressionPoints), [regressionPoints]);
  const nextPredictedStrength = visibleWorkouts.length
    ? roundTo(predict(regression, visibleWorkouts.length + 1), 1)
    : 0;
  const trendDirection =
    regression.slope > 0.05 ? 'increasing' : regression.slope < -0.05 ? 'decreasing' : 'flat';
  const bestOneRm = visibleWorkouts.length
    ? Math.max(...visibleWorkouts.map((workout) => workout.oneRm))
    : 0;
  const latestWorkout = visibleWorkouts.at(-1) ?? null;
  const previousBest = visibleWorkouts.slice(0, -1).reduce((best, workout) => Math.max(best, workout.oneRm), 0);
  const isNewPersonalBest = Boolean(latestWorkout && latestWorkout.oneRm > previousBest);
  const totalVolume = visibleWorkouts.reduce((sum, workout) => sum + workout.volume, 0);
  const streakDays = calculateStreak(visibleWorkouts);
  const progressSummary = calculateProgressSummary(visibleWorkouts);
  const scoreData = calculateFitnessScore(visibleWorkouts);
  const insights = buildInsights(visibleWorkouts);
  const recentEntries = [...visibleWorkouts].reverse();

  const summary = {
    workoutCount: visibleWorkouts.length,
    bestOneRm,
    nextPredictedStrength,
    trendDirection,
    trendSlope: regression.slope,
    streakDays,
    isNewPersonalBest,
    totalVolume: roundTo(totalVolume, 1),
    progressSummary: progressSummary.message,
    predictionExplanation: `Based on your last ${visibleWorkouts.length} workouts`,
  };

  function handleAddWorkout(newWorkout) {
    const workoutToStore = {
      id: createWorkoutId(),
      exerciseName: newWorkout.exerciseName.trim(),
      weight: safeNumber(newWorkout.weight),
      reps: safeNumber(newWorkout.reps),
      sets: safeNumber(newWorkout.sets),
      bodyWeight: safeNumber(newWorkout.bodyWeight),
      sleepHours:
        newWorkout.sleepHours === null ? null : safeNumber(newWorkout.sleepHours),
      date: new Date().toISOString(),
    };

    setWorkouts((currentWorkouts) => [...currentWorkouts, workoutToStore]);
  }

  function handleDeleteWorkout(workoutId) {
    setWorkouts((currentWorkouts) => currentWorkouts.filter((workout) => workout.id !== workoutId));
  }

  function handleReset() {
    const shouldReset = typeof window === 'undefined' ? true : window.confirm('Delete all saved workouts?');
    if (!shouldReset) {
      return;
    }

    setWorkouts([]);
    setSelectedExercise('All exercises');
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(DEMO_FLAG_KEY, 'true');
    }
  }

  function handleLoadDemoData() {
    setWorkouts(DEMO_WORKOUTS);
    setSelectedExercise('All exercises');
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route
            path="/overview"
            element={
              <OverviewPage
                summary={summary}
                selectedExercise={selectedExercise}
                allWorkouts={workouts}
              />
            }
          />
          <Route
            path="/log-workout"
            element={
              <LogWorkoutPage
                exerciseOptions={exerciseOptions}
                selectedExercise={selectedExercise}
                onSelectExercise={setSelectedExercise}
                onLoadDemoData={handleLoadDemoData}
                onReset={handleReset}
                onAddWorkout={handleAddWorkout}
              />
            }
          />
          <Route
            path="/analytics"
            element={<AnalyticsPage visibleWorkouts={visibleWorkouts} />}
          />
          <Route
            path="/insights"
            element={
              <InsightsPage
                visibleWorkouts={visibleWorkouts}
                fitnessScore={scoreData.score}
                scoreBreakdown={scoreData.breakdown}
                insights={insights}
                summary={summary}
                latestWorkout={latestWorkout}
              />
            }
          />
          <Route
            path="/history"
            element={
              <HistoryPage
                recentEntries={recentEntries}
                onDeleteWorkout={handleDeleteWorkout}
                onReset={handleReset}
              />
            }
          />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
