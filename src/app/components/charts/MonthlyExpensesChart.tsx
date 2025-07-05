'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

type MonthlyTotal = {
  month: string; // Format: "2024-07"
  total: number;
};

export default function MonthlyExpensesChart() {
  const [data, setData] = useState<MonthlyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/transactions/summary');
        setData(res.data.monthlyTotals);
      } catch (err) {
        console.error('Failed to load monthly chart data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading chart...</p>;

  return (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
