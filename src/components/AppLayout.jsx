import { NavLink, Outlet } from 'react-router-dom';

function AppNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
          isActive
            ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function AppLayout() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6 pb-10 sm:px-6 lg:px-8">
      <nav className="sticky top-3 z-20 mb-6 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="px-2 text-sm font-semibold text-slate-800">FitLens navigation</p>
          <div className="flex flex-wrap gap-2">
            <AppNavLink to="/overview" label="Overview" />
            <AppNavLink to="/log-workout" label="Log workout" />
            <AppNavLink to="/analytics" label="Analytics" />
            <AppNavLink to="/insights" label="Insights" />
            <AppNavLink to="/history" label="History" />
          </div>
        </div>
      </nav>

      <Outlet />
    </main>
  );
}
