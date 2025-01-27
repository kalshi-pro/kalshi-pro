'use client';

import { createContext, ReactNode, useState } from 'react';

export interface DashboardContextType {
  selectedSlot: string;
  setSelectedSlot: (Slot: string) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
  selectedSlot: 'trades',
  setSelectedSlot: () => {},
});

export const DashboardContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSlot, setSelectedSlot] = useState('trades');

  const contextValue = {
    selectedSlot,
    setSelectedSlot,
  };

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
};
