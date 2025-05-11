
import React, { createContext, useContext, useState } from 'react';

type ChatCache = Record<string, string>;
type ChatCacheContextType = {
  setChatData: (key: string, value: string) => void;
  getChatData: (key: string) => string | undefined;
};

const ChatCacheContext = createContext<ChatCacheContextType | null>(null);

export const ChatCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatCache, setChatCache] = useState<ChatCache>({});

  const setChatData = (key: string, value: string) => {
    setChatCache((prev) => ({ ...prev, [key]: value }));
  };

  const getChatData = (key: string) => chatCache[key];

  return (
    <ChatCacheContext.Provider value={{ getChatData, setChatData }}>
      {children}
    </ChatCacheContext.Provider>
  );
};

export const useChatCache = () => {
  const context = useContext(ChatCacheContext);
  if (!context) {
    throw new Error('useChatCache must be used within a ChatCacheProvider');
  }
  return context;
};
