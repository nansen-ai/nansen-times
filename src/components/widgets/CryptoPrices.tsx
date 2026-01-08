'use client';

import { useEffect, useState } from 'react';
import { CryptoPrice } from '@/lib/types';
import { formatPrice, formatChange } from '@/lib/prices';

export function CryptoPrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const response = await fetch('/api/prices');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPrices(data);
        setError(null);
      } catch {
        setError('Price data unavailable');
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section-border p-4">
      <h3 className="text-xs font-bold tracking-[0.2em] text-center mb-3 font-[family-name:var(--font-sans)] border-b border-[var(--border-color)] pb-2">
        LIVE CRYPTO PRICES
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-12" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-[var(--text-secondary)] text-center">{error}</p>
      ) : (
        <div className="space-y-2">
          {prices.map((price) => (
            <div key={price.symbol} className="flex justify-between items-center text-sm">
              <span className="font-bold font-[family-name:var(--font-sans)]">
                {price.symbol}
              </span>
              <div className="text-right">
                <span className="font-medium">{formatPrice(price.price)}</span>
                <span
                  className={`ml-2 text-xs ${
                    price.change24h >= 0
                      ? 'text-[var(--price-up)]'
                      : 'text-[var(--price-down)]'
                  }`}
                >
                  {price.change24h >= 0 ? '▲' : '▼'} {formatChange(price.change24h)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
