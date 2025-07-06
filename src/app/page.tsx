'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { fetchTransactions } from '@/lib/utils';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Transaction } from '@/types';
import Dashboard from './components/Dashboard';
import BudgetForm from './components/BudgetForm';
import { ErrorBoundary } from './components/ErrorBoundary';

type Budget = {
  category: string;
  amount: number;
  month: string;
};

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
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

  const loadBudgets = useCallback(async () => {
    try {
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const res = await axios.get(`/api/budgets?month=${month}`);
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to fetch budgets', err);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    await Promise.all([loadTransactions(), loadBudgets()]);
  }, [loadTransactions, loadBudgets]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 dark:text-blue-500 text-center sm:text-left">
            💸 MoneyMappr
          </h1>
          <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-800 text-center sm:text-left mt-1">
            Your Personal Finance Tracker
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 space-y-6 lg:space-y-8">
        
        {/* Row 1: Forms Section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Add Transaction */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-500 dark:text-blue-500 flex items-center gap-2">
                💰 Add Transaction
              </h2>
              <TransactionForm onTransactionAdded={loadTransactions} />
            </div>
            
            {/* Set Budget */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-500 flex items-center gap-2">
                🎯 Set Budget
              </h2>
              <BudgetForm onBudgetSaved={loadBudgets} />
            </div>
          </div>
        </section>

        {/* Row 2: Analytics Section */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Dashboard */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-500 flex items-center gap-2">
                📊 Dashboard
              </h2>
              <ErrorBoundary>
                <Dashboard transactions={transactions} budgets={budgets} />
              </ErrorBoundary>
            </div>

            {/* Transaction List */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-blue-500 flex items-center gap-2">
                📝 Recent Transactions
              </h2>
              <TransactionList 
                transactions={transactions} 
                loading={loading} 
                onRefresh={loadTransactions} 
              />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 mt-8 sm:mt-12">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            © 2025 MoneyMappr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
