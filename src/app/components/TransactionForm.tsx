// components/TransactionForm.tsx

'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { useState } from 'react';
import { string } from 'zod/v4-mini';
import { register } from 'module';

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
                {errors.amount && <p className='text-red-500'>{errors.amount.message}<p/>}
            </div>

        </form>
    )
}