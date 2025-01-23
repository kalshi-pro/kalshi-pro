export interface Settlement {
    market_result: string;
    no_count: bigint;
    no_total_cost: bigint;
    revenue: bigint;
    settled_time: string;  // Date and time in the ISO 8601 spec. Example: 2022-11-30T15:00:00Z
    ticker: string;
    yes_count: bigint;
    yes_total_cost: bigint;
}

export interface SettlementsResponse {
    settlements: Settlement[];
    cursor: string;
}