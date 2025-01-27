'use client';

import { HeroUIProvider } from '@heroui/system';
import { ReactNode } from 'react';
import { UserContextProvider } from './UserContextProvider';
import { ClerkProvider } from '@clerk/nextjs';
import { DashboardContextProvider } from './DashboardContextProvider';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <HeroUIProvider>
      <ClerkProvider>
        <UserContextProvider>
          <DashboardContextProvider>{children}</DashboardContextProvider>
        </UserContextProvider>
      </ClerkProvider>
    </HeroUIProvider>
  );
};
