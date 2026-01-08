export type ArticleCategory = 'breaking' | 'whale-watch' | 'smart-money' | 'market-brief';

export type Chain = 'ethereum' | 'solana' | 'base' | 'arbitrum' | 'optimism' | 'bitcoin' | 'multi-chain';

export type ArticleImportance = 'headline' | 'secondary' | 'brief';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  category: ArticleCategory;
  chain: Chain;
  importance: ArticleImportance;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  author: string;
  tags: string[];
  relatedAddresses?: string[];
  transactionHash?: string;
  valueUSD?: number;
}

export interface Article extends ArticleFrontmatter {
  content: string;
  filePath: string;
}

export interface MarketBrief {
  id: string;
  text: string;
  valueUSD?: number;
  chain?: Chain;
  timestamp: string;
}

export interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export interface WhaleMovement {
  id: string;
  fromAddress: string;
  toAddress: string;
  fromLabel?: string;
  toLabel?: string;
  amount: number;
  token: string;
  valueUSD: number;
  chain: Chain;
  timestamp: string;
  transactionHash: string;
}
