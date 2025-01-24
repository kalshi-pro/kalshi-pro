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

export interface OrderResponse {
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
