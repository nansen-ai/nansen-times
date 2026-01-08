import { NextResponse } from 'next/server';
import { createNansenClient } from '@/lib/nansen';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chains = searchParams.get('chains')?.split(',') || ['ethereum', 'solana', 'base'];

  try {
    const client = createNansenClient();
    const data = await client.getSmartMoneyNetflows({
      chains: chains as ('ethereum' | 'solana' | 'base')[],
      perPage: 10,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Nansen netflows error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch netflows' },
      { status: 500 }
    );
  }
}
