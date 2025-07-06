
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await connectDB();
    
    const transactions = await Transaction.find().sort({ date: -1 });
    
    const summary = {
      total: transactions.reduce((sum, tx) => sum + tx.amount, 0),
      count: transactions.length,
      categories: transactions.reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Summary fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}