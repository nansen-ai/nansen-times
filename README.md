# The Nansen Times

> **"WHEN WHALES MOVE, WE PRINT"**

A satirical crypto news website styled like a classic newspaper, featuring AI-generated articles about onchain whale movements, smart money flows, and dramatic blockchain events. Content is powered by real data from [Nansen](https://www.nansen.ai/) and updated daily.

![The Nansen Times](https://img.shields.io/badge/Status-Live-success) ![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **Sensationalist Headlines** - Tabloid-style coverage of whale movements and smart money activity
- **Real Onchain Data** - Powered by Nansen MCP for accurate blockchain intelligence
- **AI-Generated Content** - Articles automatically written based on significant onchain events
- **Classic Newspaper Design** - Vintage broadsheet layout with modern responsiveness
- **Live Price Feeds** - Real-time crypto prices for BTC, ETH, and SOL
- **Multi-Chain Coverage** - Ethereum, Solana, Base, Arbitrum, Optimism, and more

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Content | MDX (Markdown + JSX) |
| Data Source | Nansen MCP |
| AI | Anthropic Claude (via SDK) |
| Images | OpenAI DALL-E |
| Deployment | Vercel |

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 20+ and npm
- **Nansen API Key** - Get one at [app.nansen.ai/api](https://app.nansen.ai/api?tab=api)
- **OpenAI API Key** - For article generation and image creation
- **Claude Code CLI** (optional) - For using custom article generation skills

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nansen-times.git
cd nansen-times
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
# Required for article generation
OPENAI_API_KEY=sk-...

# Required for Nansen data
NANSEN_API_KEY=nansen_...
```

4. **Configure Nansen MCP** (if using Claude Code CLI)

```bash
claude mcp add --transport http nansen https://mcp.nansen.ai/ra/mcp --header "NANSEN-API-KEY: YOUR_API_KEY_HERE"
```

Alternatively, set the `NANSEN_API_KEY` environment variable:

```bash
export NANSEN_API_KEY=your_key_here
```

## Usage

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Generate Articles

Generate new articles based on recent onchain events:

```bash
npm run generate-articles
```

This script:
1. Queries Nansen MCP for significant whale movements and smart money activity
2. Generates sensationalist headlines and article content using AI
3. Creates dramatic images via DALL-E
4. Saves articles as MDX files in `/content/articles/`

### Claude Code Skills

If you're using [Claude Code CLI](https://github.com/anthropics/claude-code), you have access to custom skills for content generation:

- **`/generate-articles`** - Generate daily articles from Nansen data
- **`/whale-watch`** - Create a whale watch report focusing on biggest smart money movements
- **`/market-forecast`** - Generate a dramatic whale forecast based on sentiment analysis
- **`/token-deep-dive [token]`** - Create an in-depth investigation of a specific token's smart money activity

Example:

```bash
claude
> /whale-watch
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
nansen-times/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Homepage (newspaper layout)
│   │   ├── article/[slug]/    # Article detail pages
│   │   └── api/               # API routes (prices, Nansen data)
│   ├── components/
│   │   ├── layout/            # Masthead, Ticker, Footer
│   │   ├── articles/          # Article cards, headlines
│   │   └── widgets/           # Crypto prices, whale forecast
│   └── lib/
│       ├── articles.ts        # MDX loading utilities
│       ├── nansen.ts          # Nansen API client
│       └── types.ts           # TypeScript interfaces
├── content/
│   └── articles/              # MDX articles organized by date
│       └── YYYY/MM/DD/
├── scripts/
│   └── generate-articles.ts   # Article generation script
├── .claude/
│   └── commands/              # Custom Claude Code skills
├── public/
│   └── images/                # Generated article images
├── CLAUDE.md                  # Claude Code context
├── SPEC.md                    # Product specification
└── README.md                  # This file
```

## Article Structure

Articles are stored as MDX files with frontmatter:

```mdx
---
title: "WHALE ALERT! Dormant Bitcoin Giant AWAKENS!"
slug: whale-moves-100m-btc
publishedAt: 2026-01-08T14:00:00Z
category: whale-watch
chain: bitcoin
importance: headline
excerpt: "A wallet dormant since 2014 just moved 5,000 BTC worth over $100 million..."
image: /images/articles/2026/01/08/whale-moves-100m-btc.png
imageAlt: "Dramatic illustration of a whale emerging from dark waters"
author: "Nansen AI Correspondent"
tags:
  - whale
  - bitcoin
  - large-transfer
valueUSD: 100000000
---

Your article content here...
```

## API Routes

The app includes several API endpoints:

- `GET /api/prices` - Real-time crypto prices (BTC, ETH, SOL)
- `GET /api/nansen/netflows` - Smart money net flows
- `GET /api/nansen/dex-trades` - Recent DEX trades by smart money
- `GET /api/nansen/holdings` - Smart money token holdings

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NANSEN_API_KEY`
4. Deploy

The site will auto-deploy on every push to the main branch.

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with Docker

## Development Workflow

1. **Generate content** - Run article generation script or use Claude Code skills
2. **Preview locally** - Check the generated articles at http://localhost:3000
3. **Commit changes** - Articles are stored as files in the repository
4. **Deploy** - Push to main branch for automatic deployment

## Writing Style Guidelines

### Headlines
- Use ALL CAPS for emphasis
- Include exclamation marks for urgency
- Lead with action verbs: DUMPS, AWAKENS, FLEES, SURGES
- Include dollar amounts when impressive

**Examples:**
- "WHALE DUMPS $50M ETH AS PRICE TANKS!"
- "MYSTERY WALLET AWAKENS AFTER 8 YEARS!"
- "SMART MONEY EXODUS: Top Wallets Flee in Droves"

### Article Body
- 2-4 paragraphs per article
- First paragraph: Core facts (who, what, when, how much)
- Middle: Context, speculation, and drama
- Final: What to watch next
- Include truncated addresses and transaction values

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [ ] Automated hourly article generation via GitHub Actions
- [ ] Article archive and search functionality
- [ ] Social sharing with custom Twitter cards
- [ ] Email newsletter subscription
- [ ] RSS feed
- [ ] Real-time WebSocket price updates
- [ ] Historical whale tracking charts
- [ ] Wallet watchlist feature

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- **Nansen** - For providing world-class blockchain analytics data
- **Anthropic Claude** - For AI-powered article generation
- **OpenAI DALL-E** - For dramatic article imagery

---

Built with sensationalism by the crypto community, for the crypto community.

**Questions or feedback?** Open an issue or reach out on Twitter [@NansenTimes](https://twitter.com/nansen)
