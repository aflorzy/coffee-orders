import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/queries';
import type { OrderFormData } from '@/lib/types';

export function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderFormData = await request.json();
    const id = createOrder(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
