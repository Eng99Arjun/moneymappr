'use client';

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Transaction } from '@/types';

type Props = {
  transactions: Transaction[];
};

const MonthlyBarChart = ({ transactions }: Props) => {
  // Group by month
  const data = transactions.reduce<Record<string, number>>((acc, tx) => {
    const month = new Date(tx.date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
    });

    acc[month] = (acc[month] || 0) + tx.amount;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([month, amount]) => ({
    month,
    amount,
  }));

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">📊 Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
