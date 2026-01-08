# The Nansen Times - Product Specification

> "WHEN WHALES MOVE, WE PRINT"

A sensationalist newspaper-style website featuring AI-generated articles about onchain events from the last 24 hours. Content is generated using Nansen MCP data and updated hourly.

## Overview

The Nansen Times is a crypto-native news site styled like a classic broadsheet newspaper, but with tabloid-style headlines and dramatic coverage of whale movements, large transfers, and significant onchain activity across multiple blockchain networks.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Content | Markdown files (MDX) |
| Data Source | Nansen MCP |
| Images | AI-generated (OpenAI DALL-E) |
| Deployment | Vercel |
| Price Data | CoinGecko API (free tier) |

## Content Focus

### Primary Coverage
- **Whale Movements**: Large wallet transfers, accumulation patterns, dormant wallet activity
- **Smart Money Flows**: What top-performing wallets are buying/selling
- **Large Transfers**: Significant token movements between wallets/exchanges

### Supported Chains
- Ethereum
- Solana
- Base
- Arbitrum
- Optimism
- Other major L1s/L2s as data permits

### Tone & Style
- **Tabloid sensationalism**: Dramatic headlines, urgent language, exclamation marks
- **Examples**:
  - "WHALE ALERT! Dormant Bitcoin Giant AWAKENS After 10 Years!"
  - "SMART MONEY EXODUS: Top Wallets DUMP $50M in Mystery Token!"
  - "BREAKING: Anonymous Whale Moves $100M to Unknown Address!"

## Site Structure

### Newspaper Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Ticker: Breaking headlines scroll]                              │
├─────────────────────────────────────────────────────────────────┤
│ VOL. I... No. XX          NEW YORK, [DATE]        PRICE: FREE   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│                     THE NANSEN TIMES                            │
│            "WHEN WHALES MOVE, WE PRINT"                   │
│                                                                  │
│         LATE CHAIN EDITION • UPDATED [TIME] UTC                 │
├───────────┬─────────────────────────────────┬───────────────────┤
│           │                                 │  LIVE CRYPTO      │
│  MARKET   │      [MAIN HEADLINE]            │  PRICES           │
│  BRIEFS   │                                 │  ───────────────  │
│           │   Dramatic whale story          │  BTC    $XX,XXX   │
│  Brief 1  │   with sensational details      │  ETH    $X,XXX    │
│  Brief 2  │                                 │  SOL    $XXX      │
│  Brief 3  │                                 │                   │
│  Brief 4  │      [AI Generated Image]       │  WHALE FORECAST   │
│           │                                 │  ───────────────  │
│           │                                 │  "Bullish winds..." │
├───────────┼─────────────────────────────────┼───────────────────┤
│           │                                 │                   │
│  WHALE    │   [SECONDARY STORIES]           │  CHAIN ACTIVITY   │
│  WATCH    │                                 │                   │
│           │   Story 1  │  Story 2           │  ETH: ████░ 78%   │
│  [List of │                                 │  SOL: ███░░ 62%   │
│  recent   │   Story 3  │  Story 4           │  BASE: ██░░░ 45%  │
│  whale    │                                 │                   │
│  moves]   │                                 │                   │
└───────────┴─────────────────────────────────┴───────────────────┘
```

### Sections

1. **Breaking News Banner** (top ticker)
   - Scrolling headlines of most recent/important stories

2. **Market Briefs** (left sidebar)
   - Short 1-2 sentence summaries of notable events
   - Quick-hit information

3. **Main Headline** (center, above fold)
   - The biggest story of the hour
   - Large typography, AI-generated image
   - Full dramatic treatment

4. **Live Crypto Prices** (right sidebar)
   - BTC, ETH, SOL real-time prices
   - 24h change indicators

5. **Whale Forecast** (right sidebar)
   - AI-generated market sentiment summary
   - Dramatic, fortune-teller style predictions

6. **Whale Watch** (left column, below fold)
   - List of recent whale movements
   - Amount, token, from/to indicators

7. **Secondary Stories** (center grid)
   - 4-6 additional stories
   - Smaller headlines, brief excerpts

8. **Chain Activity** (right sidebar)
   - Visual indicators of chain activity levels

## Data Architecture

### Article Storage

Articles stored as MDX files in `/content/articles/`:

```
/content
  /articles
    /2024
      /01
        /08
          whale-moves-100m-btc.mdx
          smart-money-dumps-token.mdx
          dormant-wallet-awakens.mdx
```

### Article Frontmatter Schema

```yaml
---
title: "WHALE ALERT! Dormant Bitcoin Giant AWAKENS!"
slug: whale-moves-100m-btc
publishedAt: 2024-01-08T14:00:00Z
updatedAt: 2024-01-08T14:00:00Z
category: whale-watch | breaking | smart-money | market-brief
chain: ethereum | solana | base | arbitrum | multi-chain
importance: headline | secondary | brief
excerpt: "A wallet dormant since 2014 just moved 5,000 BTC worth over $100 million..."
image: /images/articles/2024/01/08/whale-moves-100m-btc.png
imageAlt: "Dramatic illustration of a whale emerging from dark waters"
author: "Nansen AI Correspondent"
tags:
  - whale
  - bitcoin
  - large-transfer
relatedAddresses:
  - "bc1q..."
  - "bc1p..."
transactionHash: "0x..."
valueUSD: 100000000
---
```

### Live Data

Price data fetched client-side from CoinGecko API:
- Endpoint: `https://api.coingecko.com/api/v3/simple/price`
- Tokens: BTC, ETH, SOL
- Update frequency: Every 60 seconds

## Article Generation Flow

### Manual Trigger (MVP)

1. User runs: `npm run generate-articles`
2. Script queries Nansen MCP for recent onchain events
3. AI processes events and generates article content
4. AI generates image via DALL-E API
5. Articles saved as MDX files to `/content/articles/`
6. User commits and deploys (or auto-deploys via Vercel)

### Generation Script Responsibilities

```
generate-articles
├── Query Nansen MCP for events (last 1-24 hours)
├── Filter/rank events by significance
├── For each significant event:
│   ├── Generate headline (sensationalist style)
│   ├── Generate article body (2-4 paragraphs)
│   ├── Generate excerpt
│   ├── Assign category and importance
│   ├── Generate image prompt
│   ├── Call DALL-E API for image
│   └── Save MDX file with frontmatter
└── Output summary of generated articles
```

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage - newspaper layout with all sections |
| `/article/[slug]` | Individual article page |
| `/category/[category]` | Articles filtered by category |
| `/chain/[chain]` | Articles filtered by chain |
| `/archive` | Historical articles browser |

## Visual Design

### Typography
- **Masthead**: Serif font (Old London, Playfair Display, or similar)
- **Headlines**: Bold serif (Playfair Display Black)
- **Body**: Clean serif (Georgia, Charter, or similar)
- **UI/Labels**: Sans-serif (Inter)

### Color Palette
```css
--background: #faf9f6;      /* Newsprint cream */
--text-primary: #1a1a1a;    /* Near black */
--text-secondary: #4a4a4a;  /* Dark gray */
--accent-red: #c41e3a;      /* Breaking news red */
--accent-gold: #b8860b;     /* Premium/highlight */
--border: #2a2a2a;          /* Section dividers */
--price-up: #16a34a;        /* Green for gains */
--price-down: #dc2626;      /* Red for losses */
```

### Design Elements
- Heavy black borders between sections
- Newspaper column layouts
- Drop caps for article openings
- "BREAKING" and "EXCLUSIVE" badges
- Vintage newspaper ornaments/dividers
- Scrolling ticker at top

## Environment Variables

```env
# Required
OPENAI_API_KEY=sk-...           # For AI article generation & DALL-E

# Optional (for future automation)
NANSEN_API_KEY=...              # If using Nansen API directly
COINGECKO_API_KEY=...           # For higher rate limits
```

## MVP Scope

### Phase 1 - MVP (Current)
- [ ] Next.js project setup with Tailwind
- [ ] Newspaper layout components
- [ ] MDX content loading
- [ ] Homepage with all sections
- [ ] Article detail page
- [ ] Live crypto price widget
- [ ] Manual article generation script
- [ ] AI image generation integration
- [ ] Nansen MCP integration for data
- [ ] Basic responsive design

### Phase 2 - Enhancements
- [ ] Automated hourly generation (cron/GitHub Actions)
- [ ] Article archive/search
- [ ] Social sharing (Twitter cards, OG images)
- [ ] Email newsletter signup
- [ ] RSS feed
- [ ] Category/chain filter pages

### Phase 3 - Advanced
- [ ] Real-time WebSocket price updates
- [ ] Push notifications for breaking news
- [ ] Historical whale tracking
- [ ] Wallet watchlist feature
- [ ] Premium/exclusive content section

## File Structure

```
/nansen-times
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── article/
│   │   └── [slug]/
│   │       └── page.tsx            # Article detail
│   ├── category/
│   │   └── [category]/
│   │       └── page.tsx
│   └── api/
│       └── prices/
│           └── route.ts            # Price proxy (avoid CORS)
├── components/
│   ├── layout/
│   │   ├── Masthead.tsx
│   │   ├── Ticker.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── articles/
│   │   ├── HeadlineArticle.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── MarketBrief.tsx
│   │   └── ArticleGrid.tsx
│   ├── widgets/
│   │   ├── CryptoPrices.tsx
│   │   ├── WhaleForecast.tsx
│   │   ├── ChainActivity.tsx
│   │   └── WhaleWatch.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Divider.tsx
│       └── Ornament.tsx
├── content/
│   └── articles/
│       └── [year]/[month]/[day]/
│           └── *.mdx
├── lib/
│   ├── articles.ts                 # MDX loading utilities
│   ├── prices.ts                   # Price fetching
│   └── types.ts                    # TypeScript types
├── scripts/
│   └── generate-articles.ts        # Article generation script
├── public/
│   ├── fonts/
│   └── images/
│       └── articles/
├── .claude/
│   └── settings.local.json         # MCP configuration
├── CLAUDE.md                       # Project context for Claude
├── SPEC.md                         # This file
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Success Metrics

- Articles feel genuinely engaging and sensationalist
- Newspaper aesthetic is convincing and nostalgic
- Data from Nansen MCP is accurately represented
- Site loads fast (< 2s initial load)
- Mobile experience is readable

## Open Questions

1. Should we add a "fake" classified ads section for entertainment?
2. Include a satirical horoscope based on wallet holdings?
3. Add sound effects for breaking news alerts?
