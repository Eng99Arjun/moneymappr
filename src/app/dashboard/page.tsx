'use client';

import TransactionForm from '@/app/components/TransactionForm';
import TransactionList from '@/app/components/TransactionList';
import MonthlyBarChart from '@/app/components/charts/MonthlyBarChart';
import CategoryPieChart from '@/app/components/charts/CategoryPieChart';
import BudgetComparisonChart from '@/app/components/charts/BudgetComparisonChart';
// import BudgetSummary from '@/app/components/Dashboard/BudgetSummary';
// import RecentTransactions from '@/app/components/Dashboard/RecentTransactions';

import { useEffect, useState, useCallback } from 'react';
import { Transaction } from '@/types';
import { fetchTransactions } from '@/lib/utils';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <main className="max-w-7xl mx-auto">
      {/* Navigation Bar */}
      <nav className="w-full p-4 border-b shadow-sm sticky top-0 z-50 bg-white dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-center">💸 Personal Finance Dashboard</h1>
      </nav>

      {/* Hero Section */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <TransactionForm onTransactionAdded={loadTransactions} />
        {/* <BudgetSummary transactions={transactions} /> */}
      </section>

      {/* Main Content Section */}
      <section className="px-6 py-4">
        {/* <TransactionList transactions={transactions} loading={loading} /> */}
      </section>

      {/* Chart Section */}
      <section className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <MonthlyBarChart transactions={transactions} />
        <CategoryPieChart transactions={transactions} />
      </section>

      {/* Budget vs Actual Comparison */}
      <section className="px-6 py-4">
        {/* <BudgetComparisonChart transactions={transactions} /> */}
      </section>

      {/* Recent Transactions */}
      <section className="px-6 py-4">
        {/* <RecentTransactions transactions={transactions} /> */}
      </section>
    </main>
  );
}
