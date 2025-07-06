'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Transaction } from '@/types';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import MonthlyBarChart from './charts/MonthlyBarChart';
import CategoryPieChart from './charts/CategoryPieChart';
import BudgetComparisonChart from './charts/BudgetComparisonChart';

type Budget = {
  category: string;
  amount: number;
  month: string;
};

type DashboardProps = {
  transactions: Transaction[];
};

export default function Dashboard({ transactions }: DashboardProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const fetchBudgets = async () => {
      try {
        const res = await axios.get(`/api/budgets?month=${month}`);
        setBudgets(res.data);
      } catch (err) {
        console.error('Failed to fetch budgets', err);
      }
    };

    fetchBudgets();
  }, []);

  if (transactions.length === 0) return null;

  const total = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const categorySpending: Record<string, number> = {};
  transactions.forEach((tx) => {
    categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* Total Expenses */}
      <Card className="p-4 bg-green-50 border border-green-200 dark:bg-green-900 dark:text-white">
        <h2 className="text-lg font-semibold">Total Expenses</h2>
        <p className="text-2xl font-bold mt-2">₹{total}</p>
      </Card>

      {/* Budget Progress Bars */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Budget vs Actual</h2>
        {budgets.length === 0 ? (
          <p className="text-sm text-muted-foreground dark:text-white">
            No budgets set for this month.
          </p>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = categorySpending[budget.category] || 0;
              const percent = Math.min((spent / budget.amount) * 100, 100);
              const over = spent > budget.amount;

              return (
                <div key={budget.category}>
                  <div className="flex justify-between mb-1 text-sm dark:text-white">
                    <span className="font-medium">{budget.category}</span>
                    <span className={`${over ? 'text-red-500 font-semibold' : ''}`}>
                      ₹{spent} / ₹{budget.amount}
                    </span>
                  </div>
                  <Progress value={percent} className={over ? 'bg-red-200' : ''} />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Charts */}
      <MonthlyBarChart transactions={transactions} />
      <CategoryPieChart transactions={transactions} />
      <BudgetComparisonChart budgets={budgets} actuals={categorySpending} />
    </div>
  );
}
