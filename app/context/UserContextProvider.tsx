"use client";

import { createContext, ReactNode, useState } from "react";
import { KeyModal } from "../components/key-modal";
import { Button } from "@heroui/react";

export type UserContextType = {
  accessKey: string;
  setAccessKey: (accessKey: string) => void;
  privateKey: string;
  setPrivateKey: (privateKey: string) => void;
};

export const UserContext = createContext<UserContextType>({
  accessKey: "",
  setAccessKey: () => {},
  privateKey: "",
  setPrivateKey: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [accessKey, setAccessKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const contextValue = {
    accessKey,
    setAccessKey,
    privateKey,
    setPrivateKey,
  };

  return (
    <UserContext.Provider value={contextValue}>
      <KeyModal />

      {accessKey && privateKey ? (
        <>{children}</>
      ) : (
        <div className="h-screen w-full flex flex-col justify-center items-center font-bold">
          Please add your keys to continue
          <Button
            onPress={() => {
              window.location.reload();
            }}
          >
            Add Keys
          </Button>
        </div>
      )}
    </UserContext.Provider>
  );
};
