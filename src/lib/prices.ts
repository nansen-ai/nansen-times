import { CryptoPrice } from './types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

const COIN_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

export async function fetchPrices(): Promise<CryptoPrice[]> {
  const ids = Object.values(COIN_IDS).join(',');

  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    {
      next: { revalidate: 60 }, // Cache for 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch prices');
  }

  const data = await response.json();

  return Object.entries(COIN_IDS).map(([symbol, id]) => ({
    symbol,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    price: data[id]?.usd || 0,
    change24h: data[id]?.usd_24h_change || 0,
  }));
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `$${price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}
