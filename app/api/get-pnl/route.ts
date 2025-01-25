import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { Fill, Trade, UserPnL } from '@/types/KalshiAPI';

export async function POST(request: Request) {
  const { accessKey, encryptedPrivateKey } = await request.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    // TODO: last pnl fetched

    await fetch('/api/get-settlements', {
      method: 'POST',
      body: JSON.stringify({
        accessKey,
        encryptedPrivateKey,
      }),
    });
    const supabase = await createClient();
    const { data: settlements, error: settlementsError } = await supabase
      .from('settlements')
      .select('*')
      .eq('user_id', userId);

    if (settlementsError) {
      throw new Error('Failed to fetch settlements from the database:' + settlementsError.message);
    }

    const { data: fills, error: fillsError } = await supabase
      .from('fills')
      .select('*')
      .eq('user_id', userId);

    if (fillsError) {
      throw new Error('Failed to fetch fills from the database:' + fillsError.message);
    }
    //  { [ticker]: {bought: [], sold [], settled[]} }
    // i want to determin the profit. so, first determine how many
    // shares were bought and sold for each ticker, and whatever left
    // over, see if there's a settlement for it. if not, settled object
    // would be empty, otherwise, determine the profit.

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

    for (const ticker in temp) {
      const { bought, sold } = temp[ticker];
      const boughtCount = bought.reduce((acc, fill) => acc + fill.count, 0);
      const soldCount = sold.reduce((acc, fill) => acc + fill.count, 0);
      const remainingCount = boughtCount - soldCount;

      if (remainingCount > 0) {
        const settled = settlements.find((settlement) => settlement.ticker === ticker);
        if (settled) {
          temp[ticker].settled.push(settled);
        }
      }
    }

    // calculate the profit
    const userPnL: UserPnL = {};

    return NextResponse.json({ settlements });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
