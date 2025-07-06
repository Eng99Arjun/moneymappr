// Transaction model type used across form, API, and UI
export type Transaction = {
  _id: string;
  amount: number;
  description?: string;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Other';
  date: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardData {
  totalExpenses: number;
  categorySpending: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    amount: number;
  }>;
}
