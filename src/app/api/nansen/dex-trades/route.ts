import { NextResponse } from 'next/server';
import { createNansenClient } from '@/lib/nansen';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chains = searchParams.get('chains')?.split(',') || ['ethereum', 'solana', 'base'];
  const minValue = searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : 100000;

  try {
    const client = createNansenClient();
    const data = await client.getSmartMoneyDexTrades({
      chains: chains as ('ethereum' | 'solana' | 'base')[],
      minTradeValue: minValue,
      perPage: 20,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Nansen dex-trades error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch DEX trades' },
      { status: 500 }
    );
  }
}
