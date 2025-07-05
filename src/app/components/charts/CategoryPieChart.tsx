'use client';

import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '@/types';

type Props = {
  transactions: Transaction[];
};

const COLORS = ['#34d399', '#60a5fa', '#f87171', '#c084fc', '#9ca3af'];

const CategoryPieChart = ({ transactions }: Props) => {
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });

  const chartData = Object.entries(categoryTotals).map(([category, value]) => ({
    name: category,
    value,
  }));

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">🍕 Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
