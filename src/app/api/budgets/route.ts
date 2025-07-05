import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET(req: NextRequest) {
  await connectDB();

  const month = req.nextUrl.searchParams.get('month');

  if (!month) {
    return NextResponse.json({ error: 'Missing month param' }, { status: 400 });
  }

  const budgets = await Budget.find({ month });
  return NextResponse.json(budgets);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();

  const { category, amount, month } = data;

  if (!category || !amount || !month) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Update if already exists
  const existing = await Budget.findOne({ category, month });

  if (existing) {
    existing.amount = amount;
    await existing.save();
    return NextResponse.json(existing);
  }

  // Create new
  const created = await Budget.create({ category, amount, month });
  return NextResponse.json(created);
}
