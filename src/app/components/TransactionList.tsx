'use client';

import { Badge } from './ui/badge';
import { Transaction } from '@/types';

type Props = {
  transactions: Transaction[];
  loading: boolean;
};

export default function TransactionList({ transactions, loading }: Props) {
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading transactions...</p>;
  if (transactions.length === 0) return <p className="text-sm text-muted-foreground">No transactions found.</p>;

  return (
    <div className="space-y-3 mt-6">
      {transactions.map((tx) => (
        <div
          key={tx._id}
          className="flex justify-between items-center p-3 border rounded-md shadow-sm bg-white dark:bg-zinc-900"
        >
          {/* Left side: amount and description */}
          <div>
            <p className="text-base font-medium">₹{tx.amount}</p>
            {tx.description && <p className="text-sm text-muted-foreground">{tx.description}</p>}
          </div>

          {/* Right side: category + date */}
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
        </div>
      ))}
    </div>
  );
}
