import { useCallback, useEffect } from 'react';
import type { WatchHistoryType } from '@/types';

type UseWatchHistoryProps = {
  movieItemId: string | undefined;
  isAuthenticated: boolean;
  currentSecondsRef: React.MutableRefObject<number>;
  trackWatchHistoryMutate: (payload: WatchHistoryType) => Promise<unknown>;
  onEpisodeChange?: () => void;
};

const useWatchHistory = ({
  movieItemId,
  isAuthenticated,
  currentSecondsRef,
  trackWatchHistoryMutate,
  onEpisodeChange
}: UseWatchHistoryProps) => {
  const saveWatchHistory = useCallback(async () => {
    if (!movieItemId || currentSecondsRef.current <= 0 || !isAuthenticated)
      return;

    const payload: WatchHistoryType = {
      lastWatchSeconds: currentSecondsRef.current,
      movieItemId
    };

    await trackWatchHistoryMutate(payload);
  }, [
    isAuthenticated,
    movieItemId,
    currentSecondsRef,
    trackWatchHistoryMutate
  ]);

  // Save on page leave / component unmount
  useEffect(() => {
    window.addEventListener('beforeunload', saveWatchHistory);

    return () => {
      window.removeEventListener('beforeunload', saveWatchHistory);
      saveWatchHistory();
    };
  }, [saveWatchHistory]);

  // Save on episode/movie item change, then reset position
  useEffect(() => {
    saveWatchHistory().then(() => {
      currentSecondsRef.current = 0;
      onEpisodeChange?.();
    });
  }, [movieItemId, saveWatchHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save every 60 seconds during playback
  useEffect(() => {
    const interval = setInterval(saveWatchHistory, 60_000);
    return () => clearInterval(interval);
  }, [saveWatchHistory]);

  const handleSeeked = useCallback(
    (currentTime: number) => {
      currentSecondsRef.current = Math.floor(currentTime || 0);
      saveWatchHistory();
    },
    [currentSecondsRef, saveWatchHistory]
  );

  return { saveWatchHistory, handleSeeked };
};

export default useWatchHistory;
