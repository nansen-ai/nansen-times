# Whale Watch Report

Generate a whale watch report highlighting the biggest smart money movements.

## Instructions

Use Nansen MCP to find the most significant whale activities:

### Data to Fetch

1. Query smart money DEX trades with minimum $500K trade value
2. Query smart money net flows sorted by absolute value
3. Look for coordinated movements (multiple wallets, same token)

### Report Format

Create 3-5 "WHALE WATCH" articles as market briefs:

```mdx
---
title: "Brief but punchy headline"
slug: whale-watch-[token]-[action]
publishedAt: [now]
category: whale-watch
chain: [chain]
importance: brief
excerpt: "One sentence summary"
author: "[Explorer name]"
tags:
  - whale
  - [token]
valueUSD: [amount]
---

One paragraph about the whale movement.
```

### Focus Areas

- Large single transactions (> $1M)
- Dormant wallets becoming active
- Exchange deposits (potential sells)
- Exchange withdrawals (accumulation)
- Smart money consensus (multiple wallets same action)
