'use client';

import { Settlement } from '@/types/KalshiAPI';
import { useContext, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subMonths, subWeeks, startOfYear, isAfter } from 'date-fns';
import { UserContext } from '../context/UserContextProvider';
import { generateEncryptedPayload } from '@/lib/crytpo';

type TimeFilter = '1W' | '1M' | '3M' | 'YTD';

const centsToDollars = (cents: bigint): number => {
  return Number(cents) / 100;
};

function PnLChart({ settlements }: { settlements: Settlement[] }) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('YTD');

  const getFilteredData = (filter: TimeFilter) => {
    const now = new Date();
    const filterDate = {
      '1W': subWeeks(now, 1),
      '1M': subMonths(now, 1),
      '3M': subMonths(now, 3),
      YTD: startOfYear(now),
      ALL: new Date(0), // Beginning of time
    }[filter];

    return settlements
      .filter((settlement) => isAfter(new Date(settlement.settled_time), filterDate))
      .sort((a, b) => new Date(a.settled_time).getTime() - new Date(b.settled_time).getTime());
  };

  const filteredSettlements = getFilteredData(timeFilter);

  const chartData = filteredSettlements.map((settlement) => {
    const pnl = centsToDollars(
      settlement.revenue - (settlement.yes_total_cost + settlement.no_total_cost),
    );
    return {
      date: new Date(settlement.settled_time),
      pnl,
      fill: pnl >= 0 ? '#00C805' : '#FF5000',
    };
  });

  const totalPnL = chartData.reduce((sum, data) => sum + data.pnl, 0);

  return (
    <div className="h-[500px] w-full rounded-lg p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">${totalPnL.toFixed(2)}</h2>
          <p className="text-gray-500">P&L {timeFilter}</p>
        </div>

        <div className="flex gap-2">
          {(['1W', '1M', '3M', 'YTD'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`rounded px-3 py-1 ${
                timeFilter === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={(date) => format(date, 'MMM d')} minTickGap={20} />
          <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-white p-3 shadow-lg">
                    <p className="text-sm text-gray-600">
                      {format(payload[0].payload.date, 'MMM d, yyyy')}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        ((payload[0].value as number) ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      ${((payload[0].value as number) ?? 0).toFixed(2)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="pnl" radius={[4, 4, 0, 0]} fillOpacity={0.8} color="#f2f2f2" />
        </BarChart>
      </ResponsiveContainer>

      {/* Statistics Section */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-500">Winning Trades</p>
          <p className="text-lg font-bold">{chartData.filter((d) => d.pnl > 0).length}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-500">Losing Trades</p>
          <p className="text-lg font-bold">{chartData.filter((d) => d.pnl < 0).length}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-500">Largest Win</p>
          <p className="text-lg font-bold text-green-500">
            ${Math.max(...chartData.map((d) => d.pnl), 0).toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-sm text-gray-500">Largest Loss</p>
          <p className="text-lg font-bold text-red-500">
            ${Math.min(...chartData.map((d) => d.pnl), 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { privateKey, accessKey } = useContext(UserContext);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  const getSettlements = async () => {
    try {
      const encryptedPrivateKey = generateEncryptedPayload(privateKey);
      const res = await fetch('/api/get-settlements', {
        method: 'POST',
        body: JSON.stringify({
          accessKey,
          encryptedPrivateKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettlements(data.settlements);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-8 sm:items-start">
        <button onClick={getSettlements} className="rounded-lg bg-blue-500 px-8 py-4 text-white">
          Get Settlements
        </button>

        {settlements.length > 0 && <PnLChart settlements={settlements} />}

        {/* Optional: Add a table below the chart */}
        {settlements.length > 0 && (
          <div className="mt-20 w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Ticker</th>
                  <th className="p-2">Result</th>
                  <th className="p-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      {format(new Date(settlement.settled_time), 'MMM d, yyyy')}
                    </td>
                    <td className="p-2">{settlement.ticker}</td>
                    <td className="p-2">{settlement.market_result}</td>
                    <td
                      className="p-2"
                      style={{
                        color:
                          centsToDollars(
                            settlement.revenue -
                              (settlement.yes_total_cost + settlement.no_total_cost),
                          ) >= 0
                            ? '#00C805'
                            : '#FF5000',
                      }}
                    >
                      $
                      {centsToDollars(
                        settlement.revenue - (settlement.yes_total_cost + settlement.no_total_cost),
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
