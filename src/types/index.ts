// Transaction model type used across form, API, and UI
export type Transaction = {
  _id: string;
  amount: number;
  description?: string;
  date: string;
  category: 'Food' | 'Transport' | 'Bills' | 'Shopping' | 'Other';
};
