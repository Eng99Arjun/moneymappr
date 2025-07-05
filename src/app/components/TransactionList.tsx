'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import EditTransactionDialog from './EditTransactionDialog';
import { Transaction } from '@/types';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  // 🧠 Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 📅 Format ISO date string to readable format
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // ❌ Delete transaction
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions(); // 🔁 Refresh after deletion
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction');
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading transactions...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-3 mt-6">
      {transactions.length === 0 ? (
        <p className="text-sm text-white text-muted-foreground">No transactions found.</p>
      ) : (
        transactions.map((tx) => (
          <Card
            key={tx._id}
            className="flex justify-between items-center p-4 shadow-sm bg-white dark:bg-zinc-100"
          >
            <div>
              <p className="text-base font-medium">₹{tx.amount}</p>
              {tx.description && (
                <p className="text-sm text-muted-foreground">{tx.description}</p>
              )}
            </div>

            <div className="flex flex-col items-end text-right space-y-1">
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

              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditTx(tx)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tx._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* 🛠️ Edit Transaction Dialog */}
      {editTx && (
        <EditTransactionDialog
          transaction={editTx}
          onClose={() => setEditTx(null)}
          onUpdated={() => {
            setEditTx(null);
            fetchTransactions(); // 🔁 Refresh after update
          }}
        />
      )}
    </div>
  );
}
