# The Nansen Times - Claude Context

## Project Overview

The Nansen Times is a satirical crypto news website styled like a classic newspaper. It features AI-generated articles about onchain events (whale movements, large transfers, smart money flows) with a tabloid/sensationalist tone. Content is generated using data from Nansen MCP.

**Read SPEC.md for the full product specification.**

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Content**: MDX files stored in `/content/articles/`
- **Data Source**: Nansen MCP for onchain data
- **Images**: AI-generated via OpenAI DALL-E
- **Deployment**: Vercel

## Key Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint

# Content Generation
npm run generate-articles    # Generate new articles from Nansen data
```

## Architecture Guidelines

### Article Generation

When generating articles using Nansen MCP:

1. **Query for significant events** - Focus on:
   - Whale movements (transfers > $1M)
   - Dormant wallet activity
   - Smart money accumulation/distribution
   - Unusual transaction patterns

2. **Write sensationalist headlines** - Use:
   - ALL CAPS for emphasis
   - Exclamation marks!
   - Words like: BREAKING, ALERT, EXCLUSIVE, SHOCK, MYSTERY
   - Active voice and urgent language

3. **Generate article body** - Include:
   - The facts (addresses, amounts, timestamps)
   - Dramatic speculation about motivations
   - Context about the wallet/token history
   - Quote from "anonymous sources" or "market analysts"

4. **Create image prompts** for DALL-E:
   - Dramatic, cinematic style
   - Crypto/financial imagery
   - Newspaper illustration aesthetic
   - Avoid text in images

### File Organization

```
/content/articles/[year]/[month]/[day]/[slug].mdx
```

Each article must have proper frontmatter (see SPEC.md for schema).

### Component Patterns

- Use Tailwind for all styling
- Keep components small and focused
- Use TypeScript strictly
- Client components only where necessary (prices, interactivity)

## Nansen MCP Setup

### Prerequisites

1. **Nansen API Key**: Get one at https://app.nansen.ai/api?tab=api
2. **npx**: Ensure you have it installed (`npm install -g npx`)

### Setup Options

#### Option A: Claude Code CLI (Recommended)

Run this command in your terminal:

```bash
claude mcp add --transport http nansen https://mcp.nansen.ai/ra/mcp --header "NANSEN-API-KEY: YOUR_API_KEY_HERE"
```

#### Option B: Manual Configuration

The `.claude/settings.local.json` file is already configured. You need to:

1. Set the `NANSEN_API_KEY` environment variable:
   ```bash
   export NANSEN_API_KEY=your_key_here
   ```

2. Or update `.claude/settings.local.json` directly with your key.

### Verifying the Connection

Once configured, you can test the MCP connection by asking Claude to query Nansen data:

```
"What are the largest whale transactions on Ethereum in the last 24 hours?"
```

## Nansen MCP Usage

The Nansen MCP provides tools for querying onchain data across 25+ blockchains.

### Key Capabilities
- **Whale Transactions**: Large transfers and movements
- **Smart Money Tracking**: What top-performing wallets are doing
- **Token Flows**: Movement analysis across chains
- **Exchange Flows**: Deposit/withdrawal patterns
- **Wallet Labeling**: Identify known entities

### Using Nansen MCP for Article Generation

When generating articles, use MCP tools directly. Example workflow:

1. Query for significant onchain events in the last 24 hours
2. Filter for newsworthy items (large values, notable wallets, unusual patterns)
3. For each event, generate a sensationalist headline and article body
4. Generate an image prompt and create the image via DALL-E
5. Save the article as an MDX file

## Writing Style Guide

### Headlines
- Maximum impact, minimum words
- Use present tense
- Include numbers when impressive
- Examples:
  - "WHALE DUMPS $50M ETH AS PRICE TANKS!"
  - "MYSTERY WALLET AWAKENS AFTER 8 YEARS!"
  - "SMART MONEY FLEES: Top Wallets Exit in Droves"

### Article Body
- 2-4 paragraphs
- First paragraph: The core facts
- Middle paragraphs: Context and speculation
- Final paragraph: What to watch next
- Include specific numbers and addresses (truncated for readability)

### Market Briefs
- Single sentence
- Just the key fact and number
- Example: "Unknown wallet moves 10,000 ETH ($25M) to Coinbase"

## Environment Variables

Required in `.env.local`:
```bash
OPENAI_API_KEY=sk-...          # For article generation & DALL-E images
NANSEN_API_KEY=nansen_...      # For Nansen MCP (also set via CLI or settings.local.json)
```

## Code Style

- TypeScript strict mode
- Functional components with hooks
- Prefer `async/await` over promises
- Use path aliases (`@/components`, `@/lib`)
- Tailwind classes in component files (no separate CSS)

## Common Tasks

### Adding a new article category
1. Update the category type in `/lib/types.ts`
2. Add styling/badge color in components
3. Update any category filters

### Modifying the layout
1. Main layout in `/app/layout.tsx`
2. Homepage sections in `/app/page.tsx`
3. Individual components in `/components/`

### Updating price widget
1. API route in `/app/api/prices/route.ts`
2. Component in `/components/widgets/CryptoPrices.tsx`

## Testing Locally

1. Create sample articles in `/content/articles/` for testing
2. Run `npm run dev`
3. Check homepage renders all sections
4. Verify article pages work

## Available Skills (Slash Commands)

Custom skills are available in `.claude/commands/`:

### /generate-articles
Generate new articles using real Nansen MCP data. Fetches smart money flows, DEX trades, and holdings to create sensationalist news articles.

### /whale-watch
Create a whale watch report focusing on the biggest smart money movements in the last 24 hours.

### /market-forecast
Generate a dramatic "whale forecast" based on current smart money sentiment analysis.

### /token-deep-dive [token]
Create an in-depth investigative article about a specific token's smart money activity.

## Nansen API Integration

The app includes a Nansen API client (`/src/lib/nansen.ts`) with these methods:

```typescript
const client = createNansenClient();

// Smart Money Net Flows - which tokens are being accumulated/distributed
await client.getSmartMoneyNetflows({ chains: ['ethereum', 'solana'] });

// DEX Trades - recent large trades by smart money
await client.getSmartMoneyDexTrades({ minTradeValue: 100000 });

// Holdings - what tokens smart money is holding
await client.getSmartMoneyHoldings({ minValueUsd: 1000000 });

// Flow Intelligence - detailed flow analysis for a token
await client.getFlowIntelligence({ chain: 'ethereum', tokenAddress: '0x...' });

// Token Screener - scan tokens across chains
await client.getTokenScreener({ timeframe: '24h' });
```

### API Routes

Live data is available via these endpoints:
- `GET /api/nansen/netflows` - Smart money net flows
- `GET /api/nansen/dex-trades` - Recent DEX trades
- `GET /api/nansen/holdings` - Smart money holdings
- `GET /api/prices` - Crypto prices (BTC, ETH, SOL)

## Deployment

Pushes to `main` branch auto-deploy to Vercel. Ensure:
- Build passes locally first
- All images are committed or generated
- Environment variables set in Vercel dashboard
