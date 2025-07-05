'use client';

import MonthlyExpensesChart from './charts/MonthlyExpensesChart';
import CategoryPieChart from './charts/CategoryPieChart';

export default function Dashboard() {
  return (
    <div className="space-y-6 px-4 py-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      {/* Responsive grid for charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
          <MonthlyExpensesChart />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 shadow-sm">
          <CategoryPieChart />
        </div>
      </div>

      {/* Future: summary cards, budget insights, etc. */}
    </div>
  );
}
