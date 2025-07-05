// components/TransactionForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Label } from './ui/label';

import { useState } from 'react';


const transactionSchema = z.object({
    amount: z.coerce.number().positive({ message:'Amount must be positive' }),
    description: z.string().optional(),
    date: z.string().min(1, { message: 'Date is required'}),
    category: z.enum(['Food', 'Transport', 'Bills', 'Shopping', 'Other'])
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function TransactionForm(){
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: {errors},
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            amount: 0,
            description: '',
            date: '',
            category: 'Other',
        }
    });

    const onSubmit = async (data: TransactionFormData ) => {
        try {
            setLoading(true);
            await axios.post('/api/transactions', data);
            setSuccessMessage('Transaction added! ');
            reset();
        } catch (error) {
            console.error(error);
            alert('Something Went Wrong');
        } finally{
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div>
                <Label htmlFor ="amount">Amount</Label>
                <Input type='number' {...register('amount')}/>
                {errors.amount && <p className='text-red-500 text-sm'>{errors.amount.message}</p>}
            </div>

            <div>
                <Label htmlFor='description'>Description</Label>
                <Input type='text' {...register('description')} />
            </div>

            <div>
                <Label htmlFor='date'>Date</Label>
                <Input type='date' {...register('date')} />
                {errors.date && <p className='text-red-500 text-sm'>{errors.date.message}</p>}
            </div>

            <div>
                <Label htmlFor='category'>Category</Label>
                <Select onValueChange={(value: z.infer<typeof transactionSchema>['category']) => setValue('category', value)} defaultValue="Other">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Bills">Bills</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && <p className='text-red-500 text-sm'>{errors.category.message}</p>}
            </div>

                  <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
            {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}


        </form>
    );
}
