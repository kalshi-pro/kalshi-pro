'use client';

import { HeroUIProvider } from '@heroui/system';
import { ReactNode } from 'react';
import { UserContextProvider } from './UserContextProvider';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <HeroUIProvider>
      <UserContextProvider>{children}</UserContextProvider>
    </HeroUIProvider>
  );
};
