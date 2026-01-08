'use client';

import { useEffect, useState } from 'react';
import { formatUSD } from '@/lib/nansen';

interface NetflowData {
  token_symbol: string;
  net_flow_24h_usd: number;
  chain: string;
  trader_count: number;
}

export function SmartMoneyWidget() {
  const [data, setData] = useState<NetflowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/nansen/netflows');
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Failed to fetch');
        }
        const result = await response.json();
        setData(result.data?.slice(0, 5) || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Data unavailable');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="section-border p-4">
      <h3 className="text-xs font-bold tracking-[0.2em] text-center mb-3 font-[family-name:var(--font-sans)] border-b border-[var(--border-color)] pb-2">
        SMART MONEY FLOWS
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-xs text-[var(--text-secondary)] text-center py-4">
          {error.includes('NANSEN_API_KEY') ? 'API key required' : error}
        </p>
      ) : data.length === 0 ? (
        <p className="text-xs text-[var(--text-secondary)] text-center py-4">
          No flow data available
        </p>
      ) : (
        <div className="space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <div>
                <span className="font-bold font-[family-name:var(--font-sans)]">
                  {item.token_symbol}
                </span>
                <span className="text-[10px] text-[var(--text-secondary)] ml-1 uppercase">
                  {item.chain.slice(0, 3)}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`font-medium ${
                    item.net_flow_24h_usd >= 0
                      ? 'text-[var(--price-up)]'
                      : 'text-[var(--price-down)]'
                  }`}
                >
                  {item.net_flow_24h_usd >= 0 ? '+' : ''}
                  {formatUSD(item.net_flow_24h_usd)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[9px] text-[var(--text-secondary)] text-center mt-3 font-[family-name:var(--font-sans)]">
        24H NET FLOW • POWERED BY{' '}
        <a
          href="https://nansen.ai"
          target="_blank"
          className="underline hover:no-underline"
        >
          NANSEN
        </a>
      </p>
    </div>
  );
}
