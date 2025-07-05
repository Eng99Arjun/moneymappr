'use client';

import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Label } from './ui/label';
import { toast } from 'sonner';

const schema = z.object({
  category: z.enum(['Food', 'Transport', 'Bills', 'Shopping', 'Other']),
  amount: z.coerce.number().positive({ message: 'Budget must be positive' }),
});

type FormData = z.infer<typeof schema>;

export default function BudgetForm({ onBudgetSaved }: { onBudgetSaved?: () => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: 'Food',
      amount: 0,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      await axios.post('/api/budgets', { ...data, month });
      toast.success('Budget saved!');
      onBudgetSaved?.();
      reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
      <h2 className="text-lg font-semibold">Set Monthly Budget</h2>

      <div>
        <Label>Category</Label>
        <Select defaultValue="Food" onValueChange={(val) => setValue('category', val as FormData['category'])}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {['Food', 'Transport', 'Bills', 'Shopping', 'Other'].map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>

      <div>
        <Label>Budget Amount</Label>
        <Input type="number" {...register('amount')} />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Budget'}
      </Button>
    </form>
  );
}
