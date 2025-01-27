'use client';

import { createContext, ReactNode, useState } from 'react';
import { KeyModal } from '../components/key-modal';
import { usePathname } from 'next/navigation';

export type UserContextType = {
  accessKey: string;
  setAccessKey: (accessKey: string) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
  keysSet: boolean;
  setKeysSet: (keysSet: boolean) => void;
  rendered: boolean;
  setRendered: (rendered: boolean) => void;
};

export const UserContext = createContext<UserContextType>({
  accessKey: '',
  setAccessKey: () => {},
  privateKey: '',
  setPrivateKey: () => {},
  keysSet: false,
  setKeysSet: () => {},
  rendered: false,
  setRendered: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessKey, setAccessKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [keysSet, setKeysSet] = useState(false);
  const [rendered, setRendered] = useState(false);
  const pathname = usePathname();

  const contextValue = {
    accessKey,
    setAccessKey,
    privateKey,
    setPrivateKey,
    keysSet,
    setKeysSet,
    rendered,
    setRendered,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {pathname !== '/' && <KeyModal />}
      {(accessKey && privateKey && keysSet) || pathname === '/' ? (
        <>{children}</>
      ) : rendered ? (
        <div className="flex h-screen items-center justify-center">
          <p>Please enter your keys to continue.</p>
          <button onClick={() => setKeysSet(true)} className="">
            Add Keys
          </button>
        </div>
      ) : (
        <></>
      )}
    </UserContext.Provider>
  );
};
