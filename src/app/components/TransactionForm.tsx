'use client';

import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Label } from './ui/label';

const schema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  description: z.string().optional(),
  category: z.enum(['Food', 'Transport', 'Bills', 'Shopping', 'Other']),
  date: z.string().min(1, { message: 'Date is required' }),
});

type FormData = z.infer<typeof schema>;

export default function TransactionForm({ onTransactionAdded }: { onTransactionAdded?: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      description: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await axios.post('/api/transactions', data);
      toast.success('Transaction added!');
      onTransactionAdded?.();
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label className='dark:text-white'>Amount (₹)</Label>
        <Input 
          type="number" 
          {...register('amount')}
          placeholder="Enter amount"
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <div>
        <Label className='dark:text-white'>Description</Label>
        <Input 
          {...register('description')}
          placeholder="Optional description"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <Label className='dark:text-white'>Category</Label>
        <Select defaultValue="Food" onValueChange={(val) => setValue('category', val as FormData['category'])}>
          <SelectTrigger className='bg-white'>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {['Food', 'Transport', 'Bills', 'Shopping', 'Other'].map((cat) => (
              <SelectItem key={cat} value={cat} className='bg-white dark:bg-zinc-900 dark:text-white'>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <Label className='dark:text-white'>Date</Label>
        <Input 
          type="date" 
          {...register('date')}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Transaction'}
      </Button>
    </form>
  );
}
