'use client';
import { Suspense, useContext } from 'react';

import { UserContext } from '@/app/context/UserContextProvider';

import { getTrades } from '@/lib/get-trades';

import TradesWidget from '@/app/components/ui/widgets/Trades';
import TradesLoadingSkeleton from '@/app/components/ui/skeletons/trades';

export default function TradesPage() {
  const { privateKey, accessKey } = useContext(UserContext);

  if (!privateKey || !accessKey) {
    return null;
  }
  const trades = getTrades(accessKey, privateKey);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Suspense fallback={<TradesLoadingSkeleton />}>
        <TradesWidget trades={trades} />
      </Suspense>
    </div>
  );
}
