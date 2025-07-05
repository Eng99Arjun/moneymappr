import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  await connectDB();
  const data = await req.json();

  const updated = await Transaction.findByIdAndUpdate(id, data, { new: true });

  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  await connectDB();

  const deleted = await Transaction.findByIdAndDelete(id);

  return deleted
    ? NextResponse.json({ message: 'Transaction deleted' })
    : NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
}
