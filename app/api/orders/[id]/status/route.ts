import { NextRequest, NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/queries';
import type { OrderStatus } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: { status: OrderStatus } = await request.json();
    updateOrderStatus(id, body.status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/orders/[id]/status error:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
