import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const {} = await request.json();
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'No user found' }, { status: 401 });
  }

  try {
    const supabase = await createClient();
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId);

    if (tradesError) {
      console.error(tradesError);
      throw new Error('Failed to fetch trades from the database:' + tradesError.message);
    }

    // generate cvs file
    const clientTypedTrades = trades.map((trade) => ({
      ...trade,
    }));

    let csv = clientTypedTrades
      .map((trade) => {
        return Object.values(trade).join(',');
      })
      .join('\n');

    const headers = Object.keys(clientTypedTrades[0]).join(',');
    csv = headers + '\n' + csv;

    return NextResponse.json({ csv });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
