'use client';
import { Trade } from '@/types/KalshiAPI';
import { use } from 'react';

import { useState } from 'react';
import { XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subMonths, subWeeks, startOfYear, isAfter } from 'date-fns';

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  Divider,
  Tooltip as HeroTooltip,
  Spinner,
} from '@heroui/react';
import { IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { downloadTrades } from '@/lib/download-trades';

export default function TradesWidget({ trades }: { trades: Promise<Trade[]> | Trade[] }) {
  const allTrades = trades instanceof Promise ? use(trades) : trades;
  const [downloading, setDownloading] = useState(false);

  return (
    <Card className="my-20 min-h-screen w-full max-w-4xl items-center justify-items-center gap-16 rounded-[2.5rem] bg-transparent p-0 font-[family-name:var(--font-geist-sans)] shadow-none">
      <CardBody className="flex flex-col items-center gap-8 sm:items-start">
        {allTrades.length > 0 && <PnLChart trades={allTrades} />}
        {/* Statistics Section */}
        <div className="grid w-full grid-cols-2 gap-4 rounded-3xl bg-secondary p-8 sm:grid-cols-4">
          <div className="rounded-xl border-2 border-neutral-500 bg-secondary p-4">
            <p className="text-sm">Winning Trades</p>
            <p className="text-3xl font-bold">
              {allTrades.filter((d) => d.gross_profit > 0).length}
            </p>
          </div>
          <div className="rounded-xl border-2 border-neutral-500 bg-secondary p-4">
            <p className="text-sm">Losing Trades</p>
            <p className="text-3xl font-bold">
              {allTrades.filter((d) => d.gross_profit < 0).length}
            </p>
          </div>
          <div className="rounded-xl border-2 border-neutral-500 bg-secondary p-4">
            <p className="text-sm">Largest Win</p>
            <p className="text-3xl font-bold text-green-500">
              ${(Math.max(...allTrades.map((d) => d.gross_profit), 0) / 100).toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border-2 border-neutral-500 bg-secondary p-4">
            <p className="text-sm">Largest Loss</p>
            <p className="text-3xl font-bold text-red-500">
              ${Math.min(...allTrades.map((d) => d.gross_profit), 0).toFixed(2)}
            </p>
          </div>
        </div>
        {allTrades.length > 0 && (
          <div className="w-full rounded-3xl bg-secondary p-8">
            <div className="flex w-full flex-row items-center justify-end">
              <button
                className="flex flex-row items-center gap-2 text-green-500 hover:text-green-700"
                disabled={downloading}
                onClick={async () => {
                  setDownloading(true);
                  try {
                    await downloadTrades();
                  } finally {
                    setDownloading(false);
                  }
                }}
              >
                {downloading ? <Spinner color="success" size="sm" /> : <IconDownload width={16} />}
                <h2 className="">{downloading ? 'Processing...' : 'Download'}</h2>
              </button>
            </div>
            <Accordion className="bg-transparent shadow-none">
              {allTrades.map((trade, index) => (
                <AccordionItem
                  key={index}
                  startContent={
                    <HeroTooltip content={`Type: ${trade.type}`} showArrow={true}>
                      <div
                        className={cn(
                          'flex h-5 w-5 flex-col items-center justify-center rounded-lg p-1 text-black',
                          trade.type === 'settlement' ? 'bg-fuchsia-200' : 'bg-amber-200',
                        )}
                      >
                        {trade.type === 'settlement' ? 'S' : 'T'}
                      </div>
                    </HeroTooltip>
                  }
                  aria-label={trade.ticker}
                  title={trade.ticker}
                  subtitle={format(new Date(trade.exit.exit_at), 'MMM d, yyyy, h:mm a')}
                  disableIndicatorAnimation={true}
                  indicator={
                    <div className="flex flex-col items-end justify-end">
                      <p className="font-bold text-foreground">
                        {trade.gross_profit >= 0 ? '+' : '-'}${trade.gross_profit / 100}
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: trade.gross_profit >= 0 ? '#00C805' : '#FF5000',
                        }}
                      >
                        {trade.gross_profit >= 0 ? '+' : '-'}
                        {(
                          ((trade.exit.price * trade.exit.count) /
                            (trade.buy.price * trade.buy.count) -
                            1) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  }
                >
                  <div className="bg-dashboard-background mb-5 flex w-full flex-col gap-2 rounded-xl bg-opacity-25 p-4">
                    <div className="flex flex-row items-center justify-between gap-2">
                      <p className="">Cost at open</p>
                      <div className="flex flex-col items-end justify-end gap-1">
                        <p className="">-${(trade.buy.count * trade.buy.price) / 100}</p>
                        <p className="text-sm opacity-70">
                          {trade.buy.price}¢ x {trade.buy.count} contracts for{' '}
                          {trade.buy.side.toLocaleUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Divider className="my-2" />

                    {trade.type === 'settlement' && (
                      <>
                        <div className="flex flex-row items-center justify-between gap-2">
                          <p className="">Market Resolved To</p>
                          <div className="flex flex-col items-end justify-end gap-1">
                            <p className="">{trade.market_result?.toLocaleUpperCase()}</p>
                          </div>
                        </div>
                        <Divider className="my-2" />
                      </>
                    )}

                    <div className="flex flex-row items-center justify-between gap-2">
                      <p className="">Credit at close</p>
                      <div className="flex flex-col items-end justify-end gap-1">
                        <p className="">+${(trade.exit.count * trade.exit.price) / 100}</p>
                        <p className="text-sm opacity-70">
                          {trade.exit.price}¢ x {trade.exit.count} contracts
                        </p>
                      </div>
                    </div>
                    <Divider className="my-2" />

                    <div className="flex flex-row items-center justify-between gap-2">
                      <p className="font-bold">Total Gross Profit</p>
                      <div className="flex flex-col items-end justify-end gap-1">
                        <p className="font-bold text-foreground">
                          {trade.gross_profit >= 0 ? '+' : '-'}${trade.gross_profit / 100}
                        </p>
                        <p
                          className="text-sm"
                          style={{
                            color: trade.gross_profit >= 0 ? '#00C805' : '#FF5000',
                          }}
                        >
                          {trade.gross_profit >= 0 ? '+' : '-'}
                          {(
                            ((trade.exit.price * trade.exit.count) /
                              (trade.buy.price * trade.buy.count) -
                              1) *
                            100
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

type TimeFilter = '1W' | '1M' | '3M' | 'YTD';

function PnLChart({ trades }: { trades: Trade[] }) {
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

    return trades
      .filter((trade) => isAfter(new Date(trade.exit.exit_at), filterDate))
      .sort((a, b) => new Date(a.exit.exit_at).getTime() - new Date(b.exit.exit_at).getTime());
  };

  const filteredTrades = getFilteredData(timeFilter);

  const chartData = filteredTrades.map((trade) => {
    const grossProfit = trade.gross_profit / 100;
    return {
      date: new Date(trade.exit.exit_at),
      grossProfit,
      fill: grossProfit >= 0 ? '#22c55e' : '#FF5000',
    };
  });

  const totalGrossProfit = chartData.reduce((sum, data) => sum + data.grossProfit, 0);

  return (
    <div className="w-full rounded-[2rem] bg-secondary p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h2 className="text-4xl font-bold">${totalGrossProfit.toFixed(2)}</h2>
          <div className="flex flex-row items-center justify-center gap-1 text-gray-500">
            Gross Profit{' '}
            <HeroTooltip content="Excluding fees." showArrow={true}>
              <IconInfoCircle width={18} />
            </HeroTooltip>
          </div>
        </div>

        <div className="flex gap-2">
          {(['1W', '1M', '3M', 'YTD'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`rounded px-3 py-1 ${
                timeFilter === filter
                  ? 'bg-foreground text-background'
                  : 'bg-transparent text-foreground hover:bg-neutral-500'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <XAxis dataKey="date" tickFormatter={(date) => format(date, 'MMM d')} minTickGap={20} />

          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.1)' }}
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
                    <p className={`text-base text-gray-600`}>{payload.length} trades</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="grossProfit" radius={[4, 4, 0, 0]} fillOpacity={1} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
