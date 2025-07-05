'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchTransactions } from '@/lib/utils';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Transaction } from '@/types';

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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">💸 Personal Finance Tracker</h1>

      <TransactionForm onTransactionAdded={loadTransactions} />

      <TransactionList transactions={transactions} loading={loading} />
    </main>
  );
}
