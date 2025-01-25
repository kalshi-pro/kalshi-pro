'use client';

import { HeroUIProvider } from '@heroui/system';
import { ReactNode } from 'react';
import { UserContextProvider } from './UserContextProvider';
import { ClerkProvider } from '@clerk/nextjs';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <HeroUIProvider>
      <ClerkProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </ClerkProvider>
    </HeroUIProvider>
  );
};
