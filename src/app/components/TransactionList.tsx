'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

import { Card } from './ui/card';
import { Badge } from './ui/badge';

type Transaction = {
  _id: string;
  amount: number;
  description?: string;
  date: string;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Other';
};

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/api/transactions');
        setTransactions(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading transactions...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-3 mt-6">
      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions found.</p>
      ) : (
        transactions.map((tx) => (
          <Card
            key={tx._id}
            className="flex justify-between items-center p-4 shadow-sm"
          >
            <div>
              <p className="text-base font-medium">₹{tx.amount}</p>
              {tx.description && (
                <p className="text-sm text-muted-foreground">{tx.description}</p>
              )}
            </div>

            <div className="flex flex-col items-end text-right">
              <Badge
                className={`capitalize ${
                  tx.category === 'Food'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : tx.category === 'Bills'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : tx.category === 'Transport'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : tx.category === 'Shopping'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                {tx.category}
              </Badge>
              <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
