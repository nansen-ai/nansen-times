import { ArticleCategory, Chain } from '@/lib/types';

interface BadgeProps {
  category?: ArticleCategory;
  chain?: Chain;
  breaking?: boolean;
}

const categoryColors: Record<ArticleCategory, string> = {
  breaking: 'bg-[var(--accent-red)] text-white',
  'whale-watch': 'bg-blue-600 text-white',
  'smart-money': 'bg-[var(--accent-gold)] text-white',
  'market-brief': 'bg-gray-700 text-white',
};

const chainLabels: Record<Chain, string> = {
  ethereum: 'ETH',
  solana: 'SOL',
  base: 'BASE',
  arbitrum: 'ARB',
  optimism: 'OP',
  bitcoin: 'BTC',
  'multi-chain': 'MULTI',
};

export function Badge({ category, chain, breaking }: BadgeProps) {
  if (breaking) {
    return (
      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider bg-[var(--accent-red)] text-white font-[family-name:var(--font-sans)]">
        BREAKING
      </span>
    );
  }

  if (category) {
    return (
      <span
        className={`inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider ${categoryColors[category]} font-[family-name:var(--font-sans)]`}
      >
        {category.toUpperCase().replace('-', ' ')}
      </span>
    );
  }

  if (chain) {
    return (
      <span className="inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider bg-gray-800 text-white font-[family-name:var(--font-sans)]">
        {chainLabels[chain]}
      </span>
    );
  }

  return null;
}
