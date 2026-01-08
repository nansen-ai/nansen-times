/**
 * Article Generation Script for The Nansen Times
 *
 * This script is designed to be run with Claude Code using Nansen MCP.
 * It provides a framework for generating articles from onchain data.
 *
 * Usage:
 *   Ask Claude Code to "generate articles for The Nansen Times" and it will
 *   use Nansen MCP to fetch real onchain data and create articles.
 *
 * Manual usage (for testing with mock data):
 *   npx tsx scripts/generate-articles.ts
 */

import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Types
interface WhaleTransaction {
  hash: string;
  from: string;
  to: string;
  fromLabel?: string;
  toLabel?: string;
  valueUSD: number;
  token: string;
  chain: string;
  timestamp: string;
}

interface ArticleData {
  title: string;
  slug: string;
  category: 'breaking' | 'whale-watch' | 'smart-money' | 'market-brief';
  chain: string;
  importance: 'headline' | 'secondary' | 'brief';
  excerpt: string;
  content: string;
  valueUSD: number;
  transactionHash?: string;
  relatedAddresses?: string[];
  tags: string[];
}

// Explorer names for bylines
const EXPLORER_NAMES = [
  'Ernest Shackleton',
  'Roald Amundsen',
  'Fridtjof Nansen',
  'Marco Polo',
  'Vasco da Gama',
  'Ferdinand Magellan',
  'Jacques Cousteau',
  'Amelia Earhart',
  'Edmund Hillary',
  'Leif Erikson',
  'Christopher Columbus',
  'James Cook',
  'David Livingstone',
  'Meriwether Lewis',
  'Sacagawea',
  'Ibn Battuta',
  'Zheng He',
  'Neil Armstrong',
  'Yuri Gagarin',
  'Tenzing Norgay',
];

function getRandomExplorer(): string {
  return EXPLORER_NAMES[Math.floor(Math.random() * EXPLORER_NAMES.length)];
}

// Helper functions
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateSensationalistHeadline(tx: WhaleTransaction): string {
  const amount = (tx.valueUSD / 1_000_000).toFixed(0);
  const headlines = [
    `WHALE ALERT! ${tx.fromLabel || 'Mystery Wallet'} Moves $${amount}M ${tx.token}!`,
    `BREAKING: $${amount}M ${tx.token} Transfer Shocks Markets!`,
    `MASSIVE ${tx.token} Movement: $${amount}M Changes Hands!`,
    `${tx.token} WHALE AWAKENS: $${amount}M On The Move!`,
  ];
  return headlines[Math.floor(Math.random() * headlines.length)];
}

function generateExcerpt(tx: WhaleTransaction): string {
  const amount = (tx.valueUSD / 1_000_000).toFixed(1);
  return `A massive transfer of $${amount}M in ${tx.token} has been detected on ${tx.chain}. ` +
    `The transaction, originating from ${tx.fromLabel || 'an unknown wallet'}, ` +
    `has sent shockwaves through the market as analysts scramble to determine the implications.`;
}

function generateArticleContent(tx: WhaleTransaction): string {
  const amount = (tx.valueUSD / 1_000_000).toFixed(1);
  return `
In a development that has captured the attention of the entire cryptocurrency community, a wallet ${tx.fromLabel ? `identified as ${tx.fromLabel}` : 'of unknown origin'} has executed a transfer of $${amount} million worth of ${tx.token} on the ${tx.chain} network.

The transaction, which occurred at ${format(new Date(tx.timestamp), 'h:mm a')} UTC, represents one of the largest single transfers seen in recent weeks. Market observers are closely watching for any follow-up movements that might indicate the purpose behind this massive shift in holdings.

"When you see transfers of this magnitude, it typically signals something significant," noted one anonymous market analyst. "Whether this is preparation for a sale, a custody change, or something else entirely remains to be seen."

The receiving address ${tx.toLabel ? `belongs to ${tx.toLabel}` : 'shows no prior transaction history'}, adding to the mystery surrounding this transfer. Traders are advised to monitor the situation closely and adjust their positions accordingly.
`.trim();
}

function determineImportance(valueUSD: number): 'headline' | 'secondary' | 'brief' {
  if (valueUSD >= 100_000_000) return 'headline';
  if (valueUSD >= 10_000_000) return 'secondary';
  return 'brief';
}

function createArticle(tx: WhaleTransaction): ArticleData {
  const title = generateSensationalistHeadline(tx);
  const importance = determineImportance(tx.valueUSD);

  return {
    title,
    slug: slugify(title).slice(0, 50) + '-' + Date.now().toString(36),
    category: importance === 'brief' ? 'market-brief' : 'whale-watch',
    chain: tx.chain.toLowerCase(),
    importance,
    excerpt: generateExcerpt(tx),
    content: generateArticleContent(tx),
    valueUSD: tx.valueUSD,
    transactionHash: tx.hash,
    relatedAddresses: [tx.from, tx.to],
    tags: ['whale', tx.token.toLowerCase(), tx.chain.toLowerCase(), 'large-transfer'],
  };
}

function saveArticle(article: ArticleData): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const dir = path.join(process.cwd(), 'content', 'articles', String(year), month, day);
  fs.mkdirSync(dir, { recursive: true });

  const frontmatter = `---
title: "${article.title}"
slug: ${article.slug}
publishedAt: ${now.toISOString()}
category: ${article.category}
chain: ${article.chain}
importance: ${article.importance}
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
author: "${getRandomExplorer()}"
tags:
${article.tags.map((t) => `  - ${t}`).join('\n')}
valueUSD: ${article.valueUSD}
${article.transactionHash ? `transactionHash: "${article.transactionHash}"` : ''}
${article.relatedAddresses ? `relatedAddresses:\n${article.relatedAddresses.map((a) => `  - "${a}"`).join('\n')}` : ''}
---

${article.content}
`;

  const filePath = path.join(dir, `${article.slug}.mdx`);
  fs.writeFileSync(filePath, frontmatter);
  return filePath;
}

// Mock data for testing (when not using Nansen MCP)
const MOCK_TRANSACTIONS: WhaleTransaction[] = [
  {
    hash: '0x' + 'a'.repeat(64),
    from: '0x' + '1'.repeat(40),
    to: '0x' + '2'.repeat(40),
    fromLabel: 'Wintermute Trading',
    valueUSD: 150_000_000,
    token: 'ETH',
    chain: 'Ethereum',
    timestamp: new Date().toISOString(),
  },
  {
    hash: '0x' + 'b'.repeat(64),
    from: '0x' + '3'.repeat(40),
    to: '0x' + '4'.repeat(40),
    toLabel: 'Binance Hot Wallet',
    valueUSD: 45_000_000,
    token: 'USDC',
    chain: 'Ethereum',
    timestamp: new Date().toISOString(),
  },
];

async function main() {
  console.log('🗞️  The Nansen Times - Article Generator\n');
  console.log('=' .repeat(50));

  // In actual usage, Nansen MCP would provide real transactions
  // For now, we use mock data to demonstrate the flow
  console.log('\n📊 Processing whale transactions...\n');

  const transactions = MOCK_TRANSACTIONS;

  for (const tx of transactions) {
    const article = createArticle(tx);
    const filePath = saveArticle(article);
    console.log(`✅ Created: ${article.title}`);
    console.log(`   📁 ${filePath}\n`);
  }

  console.log('=' .repeat(50));
  console.log(`\n✨ Generated ${transactions.length} articles!`);
  console.log('   Run `npm run dev` to see them on the site.\n');
}

main().catch(console.error);

// Export for use with Claude Code
export { createArticle, saveArticle };
export type { WhaleTransaction, ArticleData };
