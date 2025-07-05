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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            💸 Personal Finance Tracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Forms Section */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1 space-y-4 sm:space-y-6">
            {/* Add Transaction Card */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Add Transaction
              </h2>
              <TransactionForm onTransactionAdded={loadTransactions} />
            </div>
            
            {/* Budget Form Card */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Set Budget
              </h2>
              <BudgetForm onBudgetSaved={loadTransactions} />
            </div>
          </div>

          {/* Dashboard Section */}
          <div className="col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6 h-fit">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
                Dashboard
              </h2>
              <Dashboard transactions={transactions} />
            </div>
          </div>

          {/* Transaction List */}
          <div className="col-span-1 md:col-span-2 xl:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 dark:border-gray-700/20 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">
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
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/20 mt-8 sm:mt-12">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
            © 2025 Personal Finance Tracker. Built with Next.js & TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}
