'use client';

import { createContext, ReactNode, useState } from 'react';
import { KeyModal } from '../components/key-modal';

export type UserContextType = {
  accessKey: string;
  setAccessKey: (accessKey: string) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
};

export const UserContext = createContext<UserContextType>({
  accessKey: '',
  setAccessKey: () => {},
  privateKey: '',
  setPrivateKey: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessKey, setAccessKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const contextValue = {
    accessKey,
    setAccessKey,
    privateKey,
    setPrivateKey,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <KeyModal />
      {children}
    </UserContext.Provider>
  );
};
