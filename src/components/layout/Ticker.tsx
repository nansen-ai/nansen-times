'use client';

import { Article } from '@/lib/types';
import Link from 'next/link';

interface TickerProps {
  articles: Article[];
}

export function Ticker({ articles }: TickerProps) {
  // Duplicate articles for seamless scroll
  const tickerItems = [...articles, ...articles];

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--foreground)] text-[var(--background)] overflow-hidden">
      <div className="flex ticker-scroll whitespace-nowrap py-2">
        {tickerItems.map((article, index) => (
          <Link
            key={`${article.slug}-${index}`}
            href={`/article/${article.slug}`}
            className="inline-flex items-center px-6 hover:text-[var(--accent-gold)] transition-colors"
          >
            <span className="text-[var(--accent-red)] font-bold mr-2 text-xs font-[family-name:var(--font-sans)]">
              {article.category === 'breaking' ? 'BREAKING' : article.chain.toUpperCase()}
            </span>
            <span className="text-sm font-[family-name:var(--font-sans)]">
              {article.title}
            </span>
            {article.valueUSD && (
              <span className="ml-2 text-[var(--accent-gold)] text-xs">
                ${(article.valueUSD / 1_000_000).toFixed(1)}M
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
