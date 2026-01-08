import { NextResponse } from 'next/server';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

export async function GET() {
  try {
    const ids = Object.values(COIN_IDS).join(',');

    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices from CoinGecko');
    }

    const data = await response.json();

    const prices = Object.entries(COIN_IDS).map(([symbol, id]) => ({
      symbol,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      price: data[id]?.usd || 0,
      change24h: data[id]?.usd_24h_change || 0,
    }));

    return NextResponse.json(prices);
  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    );
  }
}
