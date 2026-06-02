import { NextResponse } from 'next/server';
import { deleteOrder } from '@/lib/queries';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteOrder(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/orders/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
