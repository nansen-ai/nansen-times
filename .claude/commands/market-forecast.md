# Generate Market Forecast

Create a dramatic "whale forecast" based on current smart money sentiment.

## Instructions

Use Nansen MCP to analyze current market sentiment:

### Data to Analyze

1. **Net Flow Direction**: Are smart money flows net positive or negative across major tokens?
2. **Exchange Flows**: More deposits (bearish) or withdrawals (bullish)?
3. **Accumulation Patterns**: Are funds increasing or decreasing positions?

### Generate Forecast

Based on the data, create a forecast with:

1. **Sentiment Word**: ACCUMULATE, HOLD, DISTRIBUTE, CAUTION
2. **Sentiment Score**: 0-100 based on net flows
3. **Forecast Text**: 2-3 dramatic sentences in fortune-teller style

### Calculation

```
Score = 50 + (net_positive_tokens - net_negative_tokens) * 5
       + (exchange_withdrawals > exchange_deposits ? 10 : -10)

If score > 70: ACCUMULATE
If score 50-70: HOLD
If score 30-50: CAUTION
If score < 30: DISTRIBUTE
```

### Output Format

Return a JSON object:

```json
{
  "sentiment": "ACCUMULATE",
  "score": 72,
  "forecast": "Bullish currents detected in the deep. Smart money schools forming around [top token]. Turbulence expected at the [resistance level], but experienced navigators see clear waters ahead."
}
```

### Forecast Style

Write like a mystical sea captain:
- Use nautical/exploration metaphors
- Reference "currents", "tides", "winds"
- Be dramatic but vague enough to not be wrong
- Always include a caveat about "unexpected storms"
