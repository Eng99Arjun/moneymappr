import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(){
    try {
        await connectDB();

        const transactions = await Transaction.find().sort({ date: -1});
        return NextResponse.json(transactions, { status: 200});
    } catch (error) {
        console.error('Get error', error);
        return NextResponse.json({error: 'Failed to fetch transactions '}, { status: 500});
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const { amount, description, date, category } = body;

        if(!amount || !date || !category){
            return NextResponse.json({ error: 'Missing required fields '}, { status: 400 });
        }

        const newTransaction = await Transaction.create({
            amount,
            description,
            date,
            category
        });

        return NextResponse.json(newTransaction, {status: 201});

    } catch (error) {
        console.error('POST error: ', error);
        return NextResponse.json({ error: 'Failed to add Transaction'}, { status: 500});
    }
}