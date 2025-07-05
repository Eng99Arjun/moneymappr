'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

type Props = {
  budgets: { category: string; amount: number }[];
  actuals: Record<string, number>;
};

const BudgetComparisonChart = ({ budgets, actuals }: Props) => {
  const chartData = budgets.map((budget) => ({
    category: budget.category,
    Budget: budget.amount,
    Spent: actuals[budget.category] || 0,
  }));

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">📊 Budget vs Actual</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budget" fill="#3b82f6" />
          <Bar dataKey="Spent" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetComparisonChart;
