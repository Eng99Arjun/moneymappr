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
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await axios.delete(`/api/transactions/${id}`);
      onRefresh(); // Ask parent to refresh
    } catch (err) {
      console.error(err);
      alert('Failed to delete transaction');
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground text-center py-4">Loading transactions...</p>;
  if (error) return <p className="text-sm text-red-500 text-center py-4">{error}</p>;

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No transactions found.
        </p>
      ) : (
        <div className="max-h-80 sm:max-h-96 overflow-y-auto space-y-3 scrollbar-thin">
          {transactions.map((tx) => (
            <Card
              key={tx._id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 space-y-3 sm:space-y-0"
            >
              {/* Main Info */}
              <div className="flex-1">
                <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                  ₹{tx.amount}
                </p>
                {tx.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {tx.description}
                  </p>
                )}
              </div>

              {/* Badge and Actions */}
              <div className="flex flex-row sm:flex-col justify-between sm:items-end sm:text-right space-y-0 sm:space-y-2">
                <div className="flex items-center space-x-2 sm:space-x-0 sm:flex-col sm:space-y-1">
                  <Badge
                    variant={
                      tx.category === 'Food'
                        ? 'success'
                        : tx.category === 'Bills'
                        ? 'destructive'
                        : tx.category === 'Transport'
                        ? 'default'
                        : tx.category === 'Shopping'
                        ? 'warning'
                        : 'secondary'
                    }
                    className="capitalize text-xs shadow-sm"
                  >
                    {tx.category}
                  </Badge>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(tx.date)}
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditTx(tx)}
                    className="text-xs px-2 py-1 h-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-white/30 dark:border-gray-600/30 hover:bg-white/70 dark:hover:bg-gray-700/70"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={loadingId === tx._id}
                    onClick={() => handleDelete(tx._id)}
                    className="text-xs px-2 py-1 h-8 shadow-sm"
                  >
                    {loadingId === tx._id ? '...' : 'Delete'}
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
            onRefresh();
          }}
        />
      )}
    </div>
  );
}
