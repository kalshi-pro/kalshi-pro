export interface Settlement {
  market_result: string;
  no_count: bigint;
  no_total_cost: bigint;
  revenue: bigint;
  settled_time: string; // Date and time in the ISO 8601 spec. Example: 2022-11-30T15:00:00Z
  ticker: string;
  yes_count: bigint;
  yes_total_cost: bigint;
}

export interface SettlementsResponse {
  settlements: Settlement[];
  cursor: string;
}

export interface OrdersResponse {
  cursor: string;
  orders: Order[];
}

export interface Order {
  action: 'buy' | 'sell';
  amend_count?: number;
  amend_taker_fill_count?: number;
  client_order_id: string;
  close_cancel_count?: number;
  created_time?: string;
  decrease_count?: number;
  expiration_time?: string;
  fcc_cancel_count?: number;
  last_update_time?: string;
  maker_fees?: number;
  maker_fill_cost?: number;
  maker_fill_count?: number;
  no_price: number;
  order_id: string;
  place_count?: number;
  queue_position?: number;
  remaining_count?: number;
  side: 'yes' | 'no' | 'SIDE_UNSET';
  status: 'resting' | 'canceled' | 'executed' | 'pending';
  taker_fees?: number;
  taker_fill_cost?: number;
  taker_fill_count?: number;
  taker_self_trade_cancel_count?: number;
  ticker: string;
  type: 'market' | 'limit' | 'OrderTypeUnknown';
  user_id?: string;
  yes_price: number;
}

export interface FillsResponse {
  cursor: string;
  fills: Fill[];
}

export interface Fill {
  action: 'buy' | 'sell' | 'OrderActionUnknown';
  count: number;
  created_time: string;
  is_taker: boolean;
  no_price: number;
  order_id: string;
  side: 'yes' | 'no' | 'SIDE_UNSET';
  ticker: string;
  trade_id: string;
  yes_price: number;
}

/**
 * Internal type
 * If it's settled, then settled_side is either 'yes' or 'no', and the
 * count is the number of left-over contractes to be settled and price
 * would be the price at which the contract was settled (usually 100
 * cents or 0 cents).
 */
export interface UserPnL {
  [ticker: string]: {
    profit_type: 'settled' | 'trade';
    trade?: Trade;
    settled?: {
      settled_side: 'yes' | 'no';
      count: number;
      price: number;
    };

    executed_time: string;
    side: 'yes' | 'no';
    action: 'buy' | 'sell' | 'settle';
    count: number;
    price: number;
    total: number;
    settled_side?: 'yes' | 'no';
  };
}

/**
 * Internal type
 */
export interface Trade {
  settled_time: string;
  market_result: string;
  revenue: bigint;
  yes_total_cost: bigint;
  no_total_cost: bigint;
}
