'use client';

import { createContext, useContext } from 'react';
import useWatchPlayer from './use-watch-player';

type WatchPlayerContextValue = ReturnType<typeof useWatchPlayer>;

const WatchPlayerContext = createContext<WatchPlayerContextValue | null>(null);

export function WatchPlayerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const value = useWatchPlayer();
  return (
    <WatchPlayerContext.Provider value={value}>
      {children}
    </WatchPlayerContext.Provider>
  );
}

export function useWatchPlayerContext() {
  const context = useContext(WatchPlayerContext);
  if (!context) {
    throw new Error(
      'useWatchPlayerContext must be used within a WatchPlayerProvider'
    );
  }
  return context;
}
