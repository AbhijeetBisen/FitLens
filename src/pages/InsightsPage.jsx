import Insights from '../components/Insights.jsx';
import Simulator from '../components/Simulator.jsx';

export default function InsightsPage({
  visibleWorkouts,
  fitnessScore,
  scoreBreakdown,
  insights,
  summary,
  latestWorkout,
}) {
  return (
    <div className="space-y-6">
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
    </div>
  );
}
