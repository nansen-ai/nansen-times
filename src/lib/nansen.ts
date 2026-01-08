/**
 * Nansen API Client
 * Documentation: https://docs.nansen.ai/
 */

const NANSEN_API_BASE = 'https://api.nansen.ai/api/v1';

// Types based on Nansen API responses
export interface SmartMoneyNetflow {
  token_address: string;
  token_symbol: string;
  net_flow_1h_usd: number;
  net_flow_24h_usd: number;
  net_flow_7d_usd: number;
  net_flow_30d_usd: number;
  chain: string;
  token_sectors: string[];
  trader_count: number;
  token_age_days: number;
  market_cap_usd: number;
}

export interface SmartMoneyDexTrade {
  chain: string;
  block_timestamp: string;
  transaction_hash: string;
  trader_address: string;
  trader_address_label: string | null;
  token_bought_address: string;
  token_sold_address: string;
  token_bought_amount: number;
  token_sold_amount: number;
  token_bought_symbol: string;
  token_sold_symbol: string;
  token_bought_age_days: number;
  token_sold_age_days: number;
  token_bought_market_cap: number;
  token_sold_market_cap: number;
  trade_value_usd: number;
}

export interface SmartMoneyHolding {
  chain: string;
  token_address: string;
  token_symbol: string;
  token_sectors: string[];
  value_usd: number;
  balance_24h_percent_change: number;
  holders_count: number;
  share_of_holdings_percent: number;
  token_age_days: number;
  market_cap_usd: number;
}

export interface FlowIntelligence {
  public_figure_net_flow_usd: number;
  public_figure_wallet_count: number;
  top_pnl_net_flow_usd: number;
  top_pnl_wallet_count: number;
  whale_net_flow_usd: number;
  whale_wallet_count: number;
  smart_trader_net_flow_usd: number;
  smart_trader_wallet_count: number;
  exchange_net_flow_usd: number;
  exchange_wallet_count: number;
  fresh_wallets_net_flow_usd: number;
  fresh_wallets_wallet_count: number;
}

export interface TokenScreenerResult {
  chain: string;
  token_address: string;
  token_symbol: string;
  token_age_days: number;
  market_cap_usd: number;
  liquidity: number;
  price_usd: number;
  price_change: number;
  buy_volume: number;
  sell_volume: number;
  volume: number;
  netflow: number;
}

export interface NansenApiResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    is_last_page: boolean;
  };
}

// Supported chains
export const SUPPORTED_CHAINS = [
  'ethereum',
  'solana',
  'base',
  'arbitrum',
  'optimism',
  'polygon',
  'avalanche',
  'bnb',
] as const;

export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

class NansenClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${NANSEN_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apiKey: this.apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Nansen API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Get Smart Money net flows - shows which tokens are being accumulated/distributed
   */
  async getSmartMoneyNetflows(options: {
    chains?: SupportedChain[];
    includeLabels?: string[];
    excludeLabels?: string[];
    page?: number;
    perPage?: number;
    orderBy?: { field: string; direction: 'ASC' | 'DESC' }[];
  } = {}): Promise<NansenApiResponse<SmartMoneyNetflow>> {
    return this.request('/smart-money/netflow', {
      chains: options.chains || ['ethereum', 'solana', 'base'],
      filters: {
        include_smart_money_labels: options.includeLabels || ['Fund', 'Smart Trader'],
        exclude_smart_money_labels: options.excludeLabels,
        include_stablecoins: false,
        include_native_tokens: true,
      },
      pagination: {
        page: options.page || 1,
        per_page: options.perPage || 20,
      },
      order_by: options.orderBy || [{ field: 'net_flow_24h_usd', direction: 'DESC' }],
    });
  }

  /**
   * Get recent Smart Money DEX trades
   */
  async getSmartMoneyDexTrades(options: {
    chains?: SupportedChain[];
    includeLabels?: string[];
    minTradeValue?: number;
    page?: number;
    perPage?: number;
  } = {}): Promise<NansenApiResponse<SmartMoneyDexTrade>> {
    return this.request('/smart-money/dex-trades', {
      chains: options.chains || ['ethereum', 'solana', 'base'],
      filters: {
        include_smart_money_labels: options.includeLabels || ['Fund', 'Smart Trader'],
        trade_value_usd: options.minTradeValue ? { min: options.minTradeValue } : undefined,
      },
      pagination: {
        page: options.page || 1,
        per_page: options.perPage || 20,
      },
      order_by: [{ field: 'trade_value_usd', direction: 'DESC' }],
    });
  }

  /**
   * Get Smart Money holdings - what tokens are smart money holding
   */
  async getSmartMoneyHoldings(options: {
    chains?: SupportedChain[];
    includeLabels?: string[];
    minValueUsd?: number;
    page?: number;
    perPage?: number;
  } = {}): Promise<NansenApiResponse<SmartMoneyHolding>> {
    return this.request('/smart-money/holdings', {
      chains: options.chains || ['ethereum', 'solana', 'base'],
      filters: {
        include_smart_money_labels: options.includeLabels || ['Fund', 'Smart Trader'],
        include_stablecoins: false,
        value_usd: options.minValueUsd ? { min: options.minValueUsd } : undefined,
      },
      pagination: {
        page: options.page || 1,
        per_page: options.perPage || 20,
      },
      order_by: [{ field: 'value_usd', direction: 'DESC' }],
    });
  }

  /**
   * Get flow intelligence for a specific token
   */
  async getFlowIntelligence(options: {
    chain: SupportedChain;
    tokenAddress: string;
    timeframe?: '5m' | '1h' | '6h' | '12h' | '1d' | '7d';
  }): Promise<FlowIntelligence> {
    return this.request('/tgm/flow-intelligence', {
      chain: options.chain,
      token_address: options.tokenAddress,
      timeframe: options.timeframe || '1d',
    });
  }

  /**
   * Screen tokens across chains
   */
  async getTokenScreener(options: {
    chains?: SupportedChain[];
    timeframe?: '5m' | '10m' | '1h' | '6h' | '24h' | '7d' | '30d';
    onlySmartMoney?: boolean;
    page?: number;
    perPage?: number;
    orderBy?: { field: string; direction: 'ASC' | 'DESC' }[];
  } = {}): Promise<NansenApiResponse<TokenScreenerResult>> {
    return this.request('/tgm/token-screener', {
      chains: options.chains || ['ethereum', 'solana', 'base'],
      timeframe: options.timeframe || '24h',
      filters: {
        only_smart_money: options.onlySmartMoney,
      },
      pagination: {
        page: options.page || 1,
        per_page: options.perPage || 20,
      },
      order_by: options.orderBy || [{ field: 'netflow', direction: 'DESC' }],
    });
  }
}

// Factory function to create client
export function createNansenClient(apiKey?: string): NansenClient {
  const key = apiKey || process.env.NANSEN_API_KEY;
  if (!key) {
    throw new Error('NANSEN_API_KEY is required. Set it in .env.local or pass it directly.');
  }
  return new NansenClient(key);
}

// Helper to format large numbers
export function formatUSD(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

// Helper to determine if a flow is significant
export function isSignificantFlow(netflow: number, threshold = 1_000_000): boolean {
  return Math.abs(netflow) >= threshold;
}
