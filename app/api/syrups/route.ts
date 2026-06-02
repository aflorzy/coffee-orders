import { NextRequest, NextResponse } from 'next/server';
import { getSyrups, createSyrup } from '@/lib/queries';

export function GET() {
  try {
    const syrups = getSyrups();
    return NextResponse.json(syrups);
  } catch (error) {
    console.error('GET /api/syrups error:', error);
    return NextResponse.json({ error: 'Failed to fetch syrups' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: { name: string } = await request.json();
    const id = createSyrup(body.name);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error('POST /api/syrups error:', error);
    return NextResponse.json({ error: 'Failed to create syrup' }, { status: 500 });
  }
}
