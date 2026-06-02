import { NextRequest, NextResponse } from 'next/server';
import { updateSyrup } from '@/lib/queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: { name?: string; is_active?: number } = await request.json();
    updateSyrup(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/syrups/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update syrup' }, { status: 500 });
  }
}
