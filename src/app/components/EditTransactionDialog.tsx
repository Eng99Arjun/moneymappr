'use client';


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import { Button } from './ui/button';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Transaction } from '@/types';

const formSchema = z.object({
  amount: z.coerce.number().positive(),
  description: z.string().optional(),
  date: z.string().min(1),
  category: z.enum(['Food', 'Transport', 'Bills', 'Shopping', 'Other']),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  transaction: Transaction;
  onClose: () => void;
  onUpdated: () => void;
};

export default function EditTransactionDialog({ transaction, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction.amount,
      description: transaction.description || '',
      date: transaction.date.slice(0, 10),
      category: transaction.category,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await axios.put(`/api/transactions/${transaction._id}`, data);
      onUpdated();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input type="number" {...register('amount')} />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input type="text" {...register('description')} />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" {...register('date')} />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue={transaction.category}
              onValueChange={(val) =>
                setValue('category', val as FormData['category'])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
