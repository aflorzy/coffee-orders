import { NextRequest, NextResponse } from 'next/server';
import { getBeans, createBean } from '@/lib/queries';
import type { Bean } from '@/lib/types';

export function GET() {
  try {
    const beans = getBeans();
    return NextResponse.json(beans);
  } catch (error) {
    console.error('GET /api/beans error:', error);
    return NextResponse.json({ error: 'Failed to fetch beans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Bean, 'id' | 'created_at' | 'is_active'> = await request.json();
    const id = createBean({ ...body, is_active: 1 });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/beans error:', error);
    return NextResponse.json({ error: 'Failed to create bean' }, { status: 500 });
  }
}
