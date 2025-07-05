import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 🔹 Aggregate total expenses per month (e.g. 2024-07)
    const monthlyTotals = await Transaction.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: { $toDate: '$date' } }
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 } // Sort by month ascending
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          total: 1
        }
      }
    ]);

    // 🔹 Aggregate total expenses per category
    const categoryTotals = await Transaction.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1
        }
      }
    ]);

    return NextResponse.json({ monthlyTotals, categoryTotals });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
