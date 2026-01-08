# Token Deep Dive

Generate an in-depth investigative article about a specific token's smart money activity.

## Usage

Provide a token symbol or address to analyze.

## Instructions

### Step 1: Gather Intelligence

Use Nansen MCP to research the token:

1. **Flow Intelligence**: Get flow data for the token
   - whale_net_flow_usd
   - smart_trader_net_flow_usd
   - exchange_net_flow_usd
   - fresh_wallets_net_flow_usd

2. **Holder Analysis**: Who's holding this token?
   - Top holders and their labels
   - Smart money percentage
   - Recent holder changes

3. **Trade Activity**: Recent DEX trades involving this token
   - Large buys vs sells
   - Who's trading it

### Step 2: Write Investigative Article

Create a detailed article (importance: secondary or headline):

```mdx
---
title: "INVESTIGATION: [Token] Under The Microscope!"
slug: deep-dive-[token]-[date]
publishedAt: [now]
category: smart-money
chain: [chain]
importance: secondary
excerpt: "Our analysts dig deep into [token] to uncover what smart money knows..."
author: "[Explorer name]"
tags:
  - investigation
  - [token]
  - smart-money
valueUSD: [total flow]
---

## The Setup

[Introduce the token and why it's interesting]

## Following The Money

[Analyze the flow intelligence data]
- Whale activity: [whale_net_flow_usd]
- Smart traders: [smart_trader_net_flow_usd]
- Exchange flows: [exchange_net_flow_usd]

## The Key Players

[Discuss notable holders and their activity]

## The Verdict

[Summarize findings with dramatic conclusion]

## What To Watch

[Future indicators to monitor]
```

### Tone

- Investigative journalist uncovering a story
- Use phrases like "Our sources indicate...", "The data reveals...", "Curiously..."
- Build narrative tension
- End with a strong opinion (but caveat it's not financial advice)
