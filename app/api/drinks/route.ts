import { NextResponse } from 'next/server';
import { getDrinks } from '@/lib/queries';

export function GET() {
  try {
    const drinks = getDrinks();
    return NextResponse.json(drinks);
  } catch (error) {
    console.error('GET /api/drinks error:', error);
    return NextResponse.json({ error: 'Failed to fetch drinks' }, { status: 500 });
  }
}
