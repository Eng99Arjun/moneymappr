'use client';

import axios from 'axios';
import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import EditTransactionDialog from './EditTransactionDialog';
import { Transaction } from '@/types';

type TransactionListProps = {
  transactions: Transaction[];
  loading: boolean;
  onRefresh: () => void;
};

export default function TransactionList({
  transactions,
  loading,
  onRefresh,
}: TransactionListProps) {
  const [error, setError] = useState('');
  const [editTx, setEditTx] = useState<Transaction | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      onRefresh(); // Ask parent to refresh
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction');
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading transactions...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No transactions found.
        </p>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-3">
          {transactions.map((tx) => (
            <Card
              key={tx._id}
              className="flex justify-between items-center p-4 shadow-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
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
                  <Button size="sm" variant="outline" onClick={() => setEditTx(tx)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(tx._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editTx && (
        <EditTransactionDialog
          transaction={editTx}
          onClose={() => setEditTx(null)}
          onUpdated={() => {
            setEditTx(null);
            onRefresh(); // Ask parent to reload
          }}
        />
      )}
    </div>
  );
}
