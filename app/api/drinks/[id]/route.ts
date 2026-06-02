import { NextRequest, NextResponse } from 'next/server';
import { updateDrinkDefaults } from '@/lib/queries';
import type { Drink } from '@/lib/types';

type DrinkDefaults = Partial<
  Pick<
    Drink,
    | 'default_temp'
    | 'default_syrup'
    | 'default_sweetness'
    | 'default_milk'
    | 'default_caffeine'
  >
>;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: DrinkDefaults = await request.json();
    updateDrinkDefaults(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PATCH /api/drinks/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update drink' }, { status: 500 });
  }
}
