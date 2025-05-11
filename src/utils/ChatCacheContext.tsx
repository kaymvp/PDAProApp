// ChatCacheContext.tsx
// -------------------------------------------------------------
// This file defines a React Context for storing temporary chat data,
// such as messages or state fragments, that need to persist across
// components in the chat application. This cache is stored in memory
// and resets on app restart. Useful for managing session-specific
// chat state that shouldn't go in AsyncStorage.
// -------------------------------------------------------------

import React, { createContext, useContext, useState } from 'react';

// Type definitions for the in-memory chat cache
type ChatCache = Record<string, string>;

type ChatCacheContextType = {
  setChatData: (key: string, value: string) => void;
  getChatData: (key: string) => string | undefined;
};

// Create the React Context with an initial value of null
const ChatCacheContext = createContext<ChatCacheContextType | null>(null);

// Provider component that holds the in-memory chat cache
export const ChatCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatCache, setChatCache] = useState<ChatCache>({});

  // Store a value under a unique key in the chat cache
  const setChatData = (key: string, value: string) => {
    console.log(`[ChatCache] Setting data: ${key} = ${value}`);
    setChatCache((prev) => ({ ...prev, [key]: value }));
  };

  // Retrieve a value by key from the chat cache
  const getChatData = (key: string) => {
    const value = chatCache[key];
    console.log(`[ChatCache] Getting data for key "${key}":`, value);
    return value;
  };

  return (
    <ChatCacheContext.Provider value={{ getChatData, setChatData }}>
      {children}
    </ChatCacheContext.Provider>
  );
};

// Custom hook to use the ChatCache context from any component
export const useChatCache = () => {
  const context = useContext(ChatCacheContext);
  if (!context) {
    throw new Error('useChatCache must be used within a ChatCacheProvider');
  }
  return context;
};
