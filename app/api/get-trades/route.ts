import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { Fill, Trade } from '@/types/KalshiAPI';
import { fetchNewSettlements } from '@/lib/kalshi/settlements';
import { fetchNewFills } from '@/lib/kalshi/fills';

export async function POST(request: Request) {
  const { accessKey, encryptedPrivateKey } = await request.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const publicMetadata = user.publicMetadata;
    const lastTradesFetchedAt = publicMetadata.last_trades_fetched_at as string | undefined;
    const start_date_time_utc = new Date('2024-01-01T00:00:00Z').toISOString();

    await fetchNewSettlements(accessKey, encryptedPrivateKey, userId, lastTradesFetchedAt);
    const supabase = await createClient();
    const { data: settlements, error: settlementsError } = await supabase
      .from('settlements')
      .select('*')
      .eq('user_id', userId)
      .gt('fetched_at', lastTradesFetchedAt ?? start_date_time_utc);

    if (settlementsError) {
      console.error(settlementsError);
      throw new Error('Failed to fetch settlements from the database:' + settlementsError.message);
    }

    await fetchNewFills(accessKey, encryptedPrivateKey, userId);
    const { data: fills, error: fillsError } = await supabase
      .from('fills')
      .select('*')
      .eq('user_id', userId)
      .gt('fetched_at', lastTradesFetchedAt ?? start_date_time_utc);

    if (fillsError) {
      console.error(fillsError);
      throw new Error('Failed to fetch fills from the database:' + fillsError.message);
    }

    const temp: {
      [ticker: string]: {
        bought: object[];
        sold: object[];
        settled: object[];
      };
    } = {};

    for (const fill of fills) {
      if (!temp[fill.ticker]) {
        temp[fill.ticker] = {
          bought: [],
          sold: [],
          settled: [],
        };
      }

      if (fill.action === 'buy') {
        temp[fill.ticker].bought.push(fill);
      } else {
        temp[fill.ticker].sold.push(fill);
      }
    }

    const trades = [];
    for (const ticker in temp) {
      const { bought, sold } = temp[ticker] as {
        bought: Fill[];
        sold: Fill[];
      };
      // sort bought and sold fills by created_time
      bought.sort(
        (a, b) => new Date(a.created_time).getTime() - new Date(b.created_time).getTime(),
      );
      sold.sort((a, b) => new Date(a.created_time).getTime() - new Date(b.created_time).getTime());

      // Match sold trades with corresponding bought trades
      for (const sellFill of sold) {
        let remainingCount = sellFill.count;

        for (const buyFill of bought) {
          if (buyFill.side !== sellFill.side && remainingCount > 0) {
            const tradeCount = Math.min(remainingCount, buyFill.count);

            const trade: Trade = {
              ticker,
              user_id: userId,
              gross_profit:
                tradeCount *
                ((sellFill.side === 'yes' ? sellFill.no_price : sellFill.yes_price) -
                  (buyFill.side === 'yes' ? buyFill.yes_price : buyFill.no_price)),
              type: 'trade',
              buy: {
                side: buyFill.side,
                count: tradeCount,
                price: buyFill.side === 'yes' ? buyFill.yes_price : buyFill.no_price,
                bought_at: buyFill.created_time,
              },
              exit: {
                side: sellFill.side,
                count: tradeCount,
                price: sellFill.side === 'yes' ? sellFill.no_price : sellFill.yes_price,
                exit_at: sellFill.created_time,
              },
            };

            trades.push(trade);
            remainingCount -= tradeCount;
            buyFill.count -= tradeCount;
          }
        }
      }

      // Handle remaining unsold bought positions with settlements
      const boughtCount = bought.reduce((acc, fill) => acc + fill.count, 0);
      const soldCount = sold.reduce((acc, fill) => acc + fill.count, 0);
      const remainingCount = boughtCount - soldCount;

      if (remainingCount > 0) {
        const settled = settlements.find((settlement) => settlement.ticker === ticker);
        if (settled) {
          const remainingBoughtFills = bought.filter((fill) => fill.count > 0);

          for (const remainingBoughtFill of remainingBoughtFills) {
            const trade: Trade = {
              ticker,
              user_id: userId,
              gross_profit:
                remainingBoughtFill.count *
                ((settled.market_result === remainingBoughtFill.side ? 100 : 0) -
                  (remainingBoughtFill.side === 'yes'
                    ? remainingBoughtFill.yes_price
                    : remainingBoughtFill.no_price)),
              type: 'settlement',
              market_result: settled.market_result,
              buy: {
                side: remainingBoughtFill.side,
                count: remainingBoughtFill.count,
                price:
                  remainingBoughtFill.side === 'yes'
                    ? remainingBoughtFill.yes_price
                    : remainingBoughtFill.no_price,
                bought_at: remainingBoughtFill.created_time,
              },
              exit: {
                side: remainingBoughtFill.side,
                count: remainingBoughtFill.count,
                price: remainingBoughtFill.side === settled.market_result ? 100 : 0,
                exit_at: settled.settled_time,
              },
            };
            trades.push(trade);
          }
        }
      }
    }

    const fetched_at = new Date().toISOString();
    await supabase.from('trades').upsert(
      trades.map((trade) => ({
        buy_bought_at: trade.buy.bought_at,
        buy_price: trade.buy.price,
        buy_side: trade.buy.side,
        buy_count: trade.buy.count,
        exit_at: trade.exit.exit_at,
        exit_price: trade.exit.price,
        exit_side: trade.exit.side,
        exit_count: trade.exit.count,
        user_id: trade.user_id,
        ticker: trade.ticker,
        gross_profit: trade.gross_profit,
        market_result: trade.market_result,
        type: trade.type,
        fetched_at,
      })),
    );

    const { data: allTrades, error: allTradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('exit_at', { ascending: false });

    if (allTradesError) {
      console.error(allTradesError);
      throw new Error('Failed to fetch trades from the database:' + allTradesError.message);
    }

    const clientTypedTrades: Trade[] = allTrades.map((trade) => ({
      ...trade,
      buy: {
        side: trade.buy_side,
        count: trade.buy_count,
        price: trade.buy_price,
        bought_at: trade.buy_bought_at,
      },
      exit: {
        side: trade.exit_side,
        count: trade.exit_count,
        price: trade.exit_price,
        exit_at: trade.exit_at,
      },
    }));

    if (settlements.length > 0 || fills.length > 0) {
      await client.users.updateUser(userId, {
        publicMetadata: {
          last_trades_fetched_at: fetched_at,
        },
      });
    }
    return NextResponse.json({ trades: clientTypedTrades });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
