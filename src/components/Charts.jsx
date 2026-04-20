import { useEffect, useMemo, useRef } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { predict } from '../utils/regression.js';
import { formatNumber } from '../utils/math.js';

ChartJS.register(
  CategoryScale,
  LineController,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        color: '#334155',
        font: {
          family: 'Trebuchet MS, Segoe UI, sans-serif',
        },
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 12,
      titleColor: '#f8fafc',
      bodyColor: '#e2e8f0',
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.14)',
      },
      ticks: {
        color: '#64748b',
      },
    },
    y: {
      grid: {
        color: 'rgba(148, 163, 184, 0.14)',
      },
      ticks: {
        color: '#64748b',
      },
    },
  },
};

function ChartCard({ title, subtitle, children }) {
  return (
    <section className="fitlens-card rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

export default function Charts({ workouts }) {
  const strengthCanvasRef = useRef(null);
  const volumeCanvasRef = useRef(null);
  const bodyWeightCanvasRef = useRef(null);
  const strengthChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const bodyWeightChartRef = useRef(null);

  const chartData = useMemo(() => {
    const sessionLabels = workouts.map((workout, index) => `S${index + 1}`);
    const strengthValues = workouts.map((workout) => workout.oneRm);
    const volumeValues = workouts.map((workout) => workout.volume);
    const bodyWeightValues = workouts.map((workout) => workout.bodyWeight);
    const regressionPoints = strengthValues.map((value, index) => ({ x: index + 1, y: value }));

    return {
      sessionLabels,
      strengthValues,
      volumeValues,
      bodyWeightValues,
      regressionPoints,
    };
  }, [workouts]);

  const regression = useMemo(() => {
    if (!chartData.regressionPoints.length) {
      return { slope: 0, intercept: 0 };
    }

    const pointCount = chartData.regressionPoints.length;
    if (pointCount === 1) {
      return { slope: 0, intercept: chartData.regressionPoints[0].y };
    }

    const totals = chartData.regressionPoints.reduce(
      (accumulator, point) => {
        accumulator.sumX += point.x;
        accumulator.sumY += point.y;
        accumulator.sumXY += point.x * point.y;
        accumulator.sumXX += point.x * point.x;
        return accumulator;
      },
      { sumX: 0, sumY: 0, sumXY: 0, sumXX: 0 },
    );

    const denominator = pointCount * totals.sumXX - totals.sumX * totals.sumX;

    if (denominator === 0) {
      return { slope: 0, intercept: totals.sumY / pointCount };
    }

    const slope =
      (pointCount * totals.sumXY - totals.sumX * totals.sumY) / denominator;
    const intercept = (totals.sumY - slope * totals.sumX) / pointCount;

    return { slope, intercept };
  }, [chartData.regressionPoints]);

  const fittedStrengthValues = useMemo(
    () => chartData.regressionPoints.map((point) => predict(regression, point.x)),
    [chartData.regressionPoints, regression],
  );
  const nextPrediction = workouts.length ? predict(regression, workouts.length + 1) : 0;
  const nextStrengthTrend = useMemo(
    () => [...fittedStrengthValues, nextPrediction],
    [fittedStrengthValues, nextPrediction],
  );

  useEffect(() => {
    if (!strengthCanvasRef.current || !workouts.length) {
      return undefined;
    }

    strengthChartRef.current?.destroy();

    const chart = new ChartJS(strengthCanvasRef.current, {
      type: 'line',
      data: {
        labels: [...chartData.sessionLabels, `S${workouts.length + 1}`],
        datasets: [
          {
            label: 'Actual 1RM',
            data: [...chartData.strengthValues, null],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#10b981',
            fill: true,
            tension: 0.35,
          },
          {
            label: 'Predicted trend',
            data: nextStrengthTrend,
            borderColor: '#f59e0b',
            borderDash: [6, 6],
            pointRadius: 0,
            tension: 0.35,
          },
        ],
      },
      options: chartDefaults,
    });
    strengthChartRef.current = chart;

    return () => {
      chart.destroy();
      if (strengthChartRef.current === chart) {
        strengthChartRef.current = null;
      }
    };
  }, [chartData.sessionLabels, chartData.strengthValues, nextStrengthTrend, workouts.length]);

  useEffect(() => {
    if (!volumeCanvasRef.current || !workouts.length) {
      return undefined;
    }

    volumeChartRef.current?.destroy();

    const chart = new ChartJS(volumeCanvasRef.current, {
      type: 'line',
      data: {
        labels: chartData.sessionLabels,
        datasets: [
          {
            label: 'Volume',
            data: chartData.volumeValues,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            pointBackgroundColor: '#2563eb',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: chartDefaults,
    });
    volumeChartRef.current = chart;

    return () => {
      chart.destroy();
      if (volumeChartRef.current === chart) {
        volumeChartRef.current = null;
      }
    };
  }, [chartData.sessionLabels, chartData.volumeValues, workouts.length]);

  useEffect(() => {
    if (!bodyWeightCanvasRef.current || !workouts.length) {
      return undefined;
    }

    bodyWeightChartRef.current?.destroy();

    const chart = new ChartJS(bodyWeightCanvasRef.current, {
      type: 'line',
      data: {
        labels: chartData.sessionLabels,
        datasets: [
          {
            label: 'Body weight',
            data: chartData.bodyWeightValues,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.12)',
            pointBackgroundColor: '#7c3aed',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: chartDefaults,
    });
    bodyWeightChartRef.current = chart;

    return () => {
      chart.destroy();
      if (bodyWeightChartRef.current === chart) {
        bodyWeightChartRef.current = null;
      }
    };
  }, [chartData.bodyWeightValues, chartData.sessionLabels, workouts.length]);

  if (!workouts.length) {
    return (
      <section className="fitlens-card rounded-3xl p-5">
        <h2 className="text-xl font-semibold text-slate-900">Progress charts</h2>
        <p className="mt-2 text-sm text-slate-600">
          Start by logging your first workout to unlock strength, volume, and body weight trends.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <ChartCard
        title="Strength trend"
        subtitle={`The dashed line is the manual linear regression forecast. Next session: ${formatNumber(nextPrediction)}.`}
      >
        <div className="h-72">
          <canvas ref={strengthCanvasRef} />
        </div>
      </ChartCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Volume trend" subtitle="Track total work across each logged session.">
          <div className="h-72">
            <canvas ref={volumeCanvasRef} />
          </div>
        </ChartCard>

        <ChartCard title="Body weight trend" subtitle="See whether changes in body weight line up with training.">
          <div className="h-72">
            <canvas ref={bodyWeightCanvasRef} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
