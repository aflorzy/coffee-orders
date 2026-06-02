import { NextRequest, NextResponse } from 'next/server';
import { updateSweetnessConfig } from '@/lib/queries';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> }
) {
  try {
    const { value } = await params;
    const body: { subtitle: string } = await request.json();
    updateSweetnessConfig(value, body.subtitle ?? '');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/sweetness-config/[value] error:', error);
    return NextResponse.json({ error: 'Failed to update sweetness config' }, { status: 500 });
  }
}
