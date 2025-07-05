


'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type CategoryTotal = {
  category: string;
  total: number;
};

// Define consistent colors for categories
const COLORS: Record<string, string> = {
  Food: '#34d399',
  Bills: '#f87171',
  Transport: '#60a5fa',
  Shopping: '#a78bfa',
  Other: '#9ca3af',
};

export default function CategoryPieChart() {
  const [data, setData] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/api/transactions/summary');
        setData(res.data.categoryTotals);
      } catch (err) {
        console.error('Failed to load category chart data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p className="text-sm text-muted-foreground">Loading chart...</p>;

  return (
    <div className="w-full h-64">
      <h2 className="text-lg font-semibold mb-2">Spending by Category</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.category] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
