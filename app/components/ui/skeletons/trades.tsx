'use client';
import { Card, Skeleton } from '@heroui/react';

export default function TradesLoadingSkeleton() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Card className="mt-20 w-full max-w-4xl space-y-5 p-4" radius="lg">
      <Skeleton className="rounded-lg">
        <div className="h-96 rounded-lg bg-default-300" />
      </Skeleton>
      <div className="flex w-full flex-row items-center justify-between space-x-2">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-16 w-1/4 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-16 w-1/4 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-16 w-1/4 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-16 w-1/4 rounded-lg bg-default-200" />
        </Skeleton>
      </div>

      <div className="space-y-3">
        <Skeleton className="w-full rounded-lg">
          <div className="h-8 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-full rounded-lg">
          <div className="h-8 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-full rounded-lg">
          <div className="h-8 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-full rounded-lg">
          <div className="h-8 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="w-full rounded-lg">
          <div className="h-8 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
    </Card>
  );
}
