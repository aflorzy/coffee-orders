import { NextRequest, NextResponse } from 'next/server';
import { updateBean, deleteBean } from '@/lib/queries';
import type { Bean } from '@/lib/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: Partial<Omit<Bean, 'id' | 'created_at'>> = await request.json();
    updateBean(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/beans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update bean' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    deleteBean(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/beans/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete bean' }, { status: 500 });
  }
}
