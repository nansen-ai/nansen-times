/**
 * Daily Article Generation Script
 *
 * This script runs via GitHub Actions to generate fresh articles daily.
 * It fetches data from Nansen API and uses Claude to write articles.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Types
interface NansenNetflow {
  token_address: string;
  token_symbol: string;
  net_flow_24h_usd: number;
  net_flow_7d_usd: number;
  chain: string;
  token_sectors: string[];
  trader_count: number;
  market_cap_usd: number;
}

interface NansenHolding {
  chain: string;
  token_address: string;
  token_symbol: string;
  value_usd: number;
  balance_24h_percent_change: number;
  holders_count: number;
}

interface GeneratedArticle {
  title: string;
  slug: string;
  category: string;
  chain: string;
  importance: string;
  excerpt: string;
  content: string;
  valueUSD: number;
  tags: string[];
  relatedAddresses: string[];
}

// Explorer names for bylines
const EXPLORER_NAMES = [
  'Ernest Shackleton', 'Roald Amundsen', 'Fridtjof Nansen', 'Marco Polo',
  'Vasco da Gama', 'Ferdinand Magellan', 'Jacques Cousteau', 'Amelia Earhart',
  'Edmund Hillary', 'Leif Erikson', 'James Cook', 'Ibn Battuta', 'Zheng He',
];

function getRandomExplorer(): string {
  return EXPLORER_NAMES[Math.floor(Math.random() * EXPLORER_NAMES.length)];
}

// Fetch Nansen data
async function fetchNansenData() {
  const apiKey = process.env.NANSEN_API_KEY;
  if (!apiKey) throw new Error('NANSEN_API_KEY required');

  const headers = {
    'Content-Type': 'application/json',
    'apiKey': apiKey,
  };

  // Fetch inflows
  const inflowsRes = await fetch('https://api.nansen.ai/api/v1/smart-money/netflow', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      chains: ['ethereum', 'solana', 'base'],
      filters: { include_smart_money_labels: ['Fund', 'Smart Trader'], include_stablecoins: false },
      pagination: { page: 1, per_page: 10 },
      order_by: [{ field: 'net_flow_24h_usd', direction: 'DESC' }],
    }),
  });
  const inflows = await inflowsRes.json();

  // Fetch outflows
  const outflowsRes = await fetch('https://api.nansen.ai/api/v1/smart-money/netflow', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      chains: ['ethereum', 'solana', 'base'],
      filters: { include_smart_money_labels: ['Fund', 'Smart Trader'], include_stablecoins: false },
      pagination: { page: 1, per_page: 10 },
      order_by: [{ field: 'net_flow_24h_usd', direction: 'ASC' }],
    }),
  });
  const outflows = await outflowsRes.json();

  // Fetch holdings
  const holdingsRes = await fetch('https://api.nansen.ai/api/v1/smart-money/holdings', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      chains: ['ethereum', 'solana', 'base'],
      filters: { include_smart_money_labels: ['Fund', 'Smart Trader'], include_stablecoins: false },
      pagination: { page: 1, per_page: 10 },
      order_by: [{ field: 'value_usd', direction: 'DESC' }],
    }),
  });
  const holdings = await holdingsRes.json();

  return {
    inflows: inflows.data as NansenNetflow[],
    outflows: outflows.data as NansenNetflow[],
    holdings: holdings.data as NansenHolding[],
  };
}

// Generate articles using Claude
async function generateArticlesWithClaude(data: {
  inflows: NansenNetflow[];
  outflows: NansenNetflow[];
  holdings: NansenHolding[];
}): Promise<GeneratedArticle[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY required');

  const client = new Anthropic({ apiKey });

  const prompt = `You are a crypto journalist for The Nansen Times, a tabloid-style newspaper covering onchain events.

Based on this real smart money data from Nansen, generate 5 news articles:
- 1 headline article (most significant event)
- 2 secondary articles
- 2 market briefs (short, one paragraph)

INFLOWS (tokens being accumulated):
${JSON.stringify(data.inflows.slice(0, 5), null, 2)}

OUTFLOWS (tokens being sold):
${JSON.stringify(data.outflows.slice(0, 5), null, 2)}

TOP HOLDINGS:
${JSON.stringify(data.holdings.slice(0, 5), null, 2)}

WRITING STYLE:
- Headlines: Use ALL CAPS sparingly, colons not exclamation marks
- Tone: Dramatic but not over-the-top, authoritative
- Include specific numbers and token symbols
- Each article should have a unique angle

Return a JSON array of articles with this structure:
[
  {
    "title": "HEADLINE: Subtitle Here",
    "slug": "lowercase-slug-here",
    "category": "breaking|whale-watch|smart-money|market-brief",
    "chain": "ethereum|solana|base|multi-chain",
    "importance": "headline|secondary|brief",
    "excerpt": "1-2 sentence summary",
    "content": "Full article body (2-4 paragraphs for headline/secondary, 1 paragraph for briefs)",
    "valueUSD": 1000000,
    "tags": ["tag1", "tag2"],
    "relatedAddresses": ["0x..."]
  }
]

Return ONLY valid JSON, no markdown or explanation.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  let text = response.content[0].type === 'text' ? response.content[0].text : '';

  // Strip markdown code blocks if present
  text = text.trim();
  if (text.startsWith('```json')) {
    text = text.slice(7);
  } else if (text.startsWith('```')) {
    text = text.slice(3);
  }
  if (text.endsWith('```')) {
    text = text.slice(0, -3);
  }
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch {
    console.error('Failed to parse Claude response:', text);
    throw new Error('Invalid JSON response from Claude');
  }
}

// Save articles to MDX files
function saveArticles(articles: GeneratedArticle[]) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const dir = path.join(process.cwd(), 'content', 'articles', String(year), month, day);

  // Clear existing articles for today to ensure fresh content
  if (fs.existsSync(dir)) {
    const existingFiles = fs.readdirSync(dir);
    for (const file of existingFiles) {
      if (file.endsWith('.mdx') || file.endsWith('.md')) {
        fs.unlinkSync(path.join(dir, file));
      }
    }
    console.log(`   Cleared ${existingFiles.length} existing articles for today`);
  }

  fs.mkdirSync(dir, { recursive: true });

  const savedFiles: string[] = [];

  for (const article of articles) {
    const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
slug: ${article.slug}
publishedAt: ${now.toISOString()}
category: ${article.category}
chain: ${article.chain}
importance: ${article.importance}
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
author: "${getRandomExplorer()}"
tags:
${article.tags.map(t => `  - ${t}`).join('\n')}
valueUSD: ${article.valueUSD}
${article.relatedAddresses.length > 0 ? `relatedAddresses:\n${article.relatedAddresses.map(a => `  - "${a}"`).join('\n')}` : ''}
---

${article.content}
`;

    const filePath = path.join(dir, `${article.slug}.mdx`);
    fs.writeFileSync(filePath, frontmatter);
    savedFiles.push(filePath);
    console.log(`✓ Created: ${article.title}`);
  }

  return savedFiles;
}

// Main
async function main() {
  console.log('🗞️  The Nansen Times - Daily Article Generation\n');
  console.log(`📅 ${format(new Date(), 'EEEE, MMMM d, yyyy')}\n`);
  console.log('='.repeat(50));

  console.log('\n📊 Fetching Nansen data...');
  const data = await fetchNansenData();
  console.log(`   Found ${data.inflows.length} inflows, ${data.outflows.length} outflows, ${data.holdings.length} holdings`);

  console.log('\n✍️  Generating articles with Claude...');
  const articles = await generateArticlesWithClaude(data);
  console.log(`   Generated ${articles.length} articles`);

  console.log('\n💾 Saving articles...');
  const files = saveArticles(articles);

  console.log('\n' + '='.repeat(50));
  console.log(`\n✨ Done! Created ${files.length} articles.`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
