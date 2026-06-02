import { NextResponse } from 'next/server';
import { getSweetnessConfigs } from '@/lib/queries';

export function GET() {
  try {
    const configs = getSweetnessConfigs();
    return NextResponse.json(configs);
  } catch (error) {
    console.error('GET /api/sweetness-config error:', error);
    return NextResponse.json({ error: 'Failed to fetch sweetness config' }, { status: 500 });
  }
}
