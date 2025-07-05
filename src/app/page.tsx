'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchTransactions } from '@/lib/utils';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Transaction } from '@/types';
import Dashboard from './components/Dashboard';
import BudgetForm from './components/BudgetForm';

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            💸 Personal Finance Tracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add Transaction
              </h2>
              <TransactionForm onTransactionAdded={loadTransactions} />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Set Budget
              </h2>
              <BudgetForm onBudgetSaved={loadTransactions} />
            </div>
          </div>

          {/* Middle Column - Dashboard */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <Dashboard transactions={transactions} />
            </div>
          </div>

          {/* Right Column - Transaction List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <TransactionList 
                transactions={transactions} 
                loading={loading} 
                onRefresh={loadTransactions} 
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2025 Personal Finance Tracker. Built with Next.js & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
