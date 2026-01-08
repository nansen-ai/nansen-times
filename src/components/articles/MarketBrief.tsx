import Link from 'next/link';
import { Article } from '@/lib/types';

interface MarketBriefProps {
  article: Article;
}

export function MarketBrief({ article }: MarketBriefProps) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="flex justify-between items-start gap-4 py-3 border-b border-[var(--border-color)] last:border-b-0 hover:bg-gray-50 transition-colors group"
    >
      <p className="text-sm leading-snug flex-1 group-hover:text-[var(--text-secondary)]">
        {article.title}
      </p>
      {article.valueUSD && (
        <span className="text-xs font-bold text-[var(--accent-gold)] whitespace-nowrap font-[family-name:var(--font-sans)]">
          ${(article.valueUSD / 1_000_000).toFixed(0)}M
        </span>
      )}
    </Link>
  );
}
