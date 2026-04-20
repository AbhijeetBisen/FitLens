import Charts from '../components/Charts.jsx';

export default function AnalyticsPage({ visibleWorkouts }) {
  return <Charts workouts={visibleWorkouts} />;
}
