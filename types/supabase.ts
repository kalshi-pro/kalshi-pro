export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      fills: {
        Row: {
          action: string | null;
          count: number;
          created_time: string;
          is_taker: boolean;
          key: string;
          no_price: number;
          order_id: string;
          side: string | null;
          ticker: string;
          trade_id: string;
          user_id: string;
          yes_price: number;
          fetched_at: string;
        };
        Insert: {
          action?: string | null;
          count: number;
          created_time: string;
          is_taker: boolean;
          key: string;
          no_price: number;
          order_id: string;
          side?: string | null;
          ticker: string;
          trade_id: string;
          user_id: string;
          yes_price: number;
          fetched_at?: string;
        };
        Update: {
          action?: string | null;
          count?: number;
          created_time?: string;
          is_taker?: boolean;
          key?: string;
          no_price?: number;
          order_id?: string;
          side?: string | null;
          ticker?: string;
          trade_id?: string;
          user_id?: string;
          yes_price?: number;
          fetched_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          action: string | null;
          amend_count: number | null;
          amend_taker_fill_count: number | null;
          client_order_id: string;
          close_cancel_count: number | null;
          created_time: string | null;
          decrease_count: number | null;
          expiration_time: string | null;
          fcc_cancel_count: number | null;
          kalshi_user_id: string | null;
          last_update_time: string | null;
          maker_fees: number | null;
          maker_fill_cost: number | null;
          maker_fill_count: number | null;
          no_price: number;
          order_id: string;
          place_count: number | null;
          queue_position: number | null;
          remaining_count: number | null;
          side: string | null;
          status: string | null;
          taker_fees: number | null;
          taker_fill_cost: number | null;
          taker_fill_count: number | null;
          taker_self_trade_cancel_count: number | null;
          ticker: string;
          type: string | null;
          user_id: string;
          yes_price: number;
          fetched_at: string;
        };
        Insert: {
          action?: string | null;
          amend_count?: number | null;
          amend_taker_fill_count?: number | null;
          client_order_id: string;
          close_cancel_count?: number | null;
          created_time?: string | null;
          decrease_count?: number | null;
          expiration_time?: string | null;
          fcc_cancel_count?: number | null;
          kalshi_user_id?: string | null;
          last_update_time?: string | null;
          maker_fees?: number | null;
          maker_fill_cost?: number | null;
          maker_fill_count?: number | null;
          no_price: number;
          order_id: string;
          place_count?: number | null;
          queue_position?: number | null;
          remaining_count?: number | null;
          side?: string | null;
          status?: string | null;
          taker_fees?: number | null;
          taker_fill_cost?: number | null;
          taker_fill_count?: number | null;
          taker_self_trade_cancel_count?: number | null;
          ticker: string;
          type?: string | null;
          user_id: string;
          yes_price: number;
          fetched_at?: string;
        };
        Update: {
          action?: string | null;
          amend_count?: number | null;
          amend_taker_fill_count?: number | null;
          client_order_id?: string;
          close_cancel_count?: number | null;
          created_time?: string | null;
          decrease_count?: number | null;
          expiration_time?: string | null;
          fcc_cancel_count?: number | null;
          kalshi_user_id?: string | null;
          last_update_time?: string | null;
          maker_fees?: number | null;
          maker_fill_cost?: number | null;
          maker_fill_count?: number | null;
          no_price?: number;
          order_id?: string;
          place_count?: number | null;
          queue_position?: number | null;
          remaining_count?: number | null;
          side?: string | null;
          status?: string | null;
          taker_fees?: number | null;
          taker_fill_cost?: number | null;
          taker_fill_count?: number | null;
          taker_self_trade_cancel_count?: number | null;
          ticker?: string;
          type?: string | null;
          user_id?: string;
          yes_price?: number;
          fetched_at?: string;
        };
        Relationships: [];
      };
      settlements: {
        Row: {
          key: string;
          market_result: string;
          no_count: bigint;
          no_total_cost: bigint;
          revenue: bigint;
          settled_time: string;
          ticker: string;
          user_id: string;
          yes_count: bigint;
          yes_total_cost: bigint;
          fetched_at: string;
        };
        Insert: {
          key: string;
          market_result: string;
          no_count: bigint;
          no_total_cost: bigint;
          revenue: bigint;
          settled_time: string;
          ticker: string;
          user_id: string;
          yes_count: bigint;
          yes_total_cost: bigint;
          fetched_at?: string;
        };
        Update: {
          key?: string;
          market_result?: string;
          no_count?: bigint;
          no_total_cost?: bigint;
          revenue?: bigint;
          settled_time?: string;
          ticker?: string;
          user_id?: string;
          yes_count?: bigint;
          yes_total_cost?: bigint;
          fetched_at?: string;
        };
        Relationships: [];
      };
      trades: {
        Row: {
          buy_bought_at: string;
          buy_count: number;
          buy_price: number;
          buy_side: string;
          exit_at: string;
          exit_count: number;
          exit_price: number;
          exit_side: string;
          gross_profit: number;
          id: number;
          market_result: string | null;
          ticker: string;
          type: string;
          user_id: string;
          fetched_at: string;
        };
        Insert: {
          buy_bought_at: string;
          buy_count: number;
          buy_price: number;
          buy_side: string;
          exit_at: string;
          exit_count: number;
          exit_price: number;
          exit_side: string;
          gross_profit: number;
          id?: never;
          market_result?: string | null;
          ticker: string;
          type: string;
          user_id: string;
          fetched_at?: string;
        };
        Update: {
          buy_bought_at?: string;
          buy_count?: number;
          buy_price?: number;
          buy_side?: string;
          exit_at?: string;
          exit_count?: number;
          exit_price?: number;
          exit_side?: string;
          gross_profit?: number;
          id?: never;
          market_result?: string | null;
          ticker?: string;
          type?: string;
          user_id?: string;
          fetched_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
