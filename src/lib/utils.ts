import axios from 'axios';
import { Transaction } from '@/types';

export function cn(...inputs: (string | false | null | undefined)[]) {
  return inputs.filter(Boolean).join(' ');
}


export const fetchTransactions = async (): Promise<Transaction[]> => {
  const res = await axios.get('/api/transactions');
  return res.data;
};