import { useDisclosure } from '@/hooks';
import type { VideoResType, WatchHistoryType } from '@/types';
import type { MediaPlayerInstance } from '@vidstack/react';
import { useEffect, useState } from 'react';

type UseContinueWatchingProps = {
  movieItemId: string | undefined;
  watchHistories: WatchHistoryType[];
  isAuthenticated: boolean;
  skipIntro: boolean;
  video: VideoResType | null | undefined;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  onIntroSkipped: () => void;
};

const useContinueWatching = ({
  movieItemId,
  watchHistories,
  isAuthenticated,
  skipIntro,
  video,
  playerRef,
  onIntroSkipped
}: UseContinueWatchingProps) => {
  const {
    opened: isShowContinueModal,
    open: showContinueModal,
    close: closeContinueModal
  } = useDisclosure();

  const [lastWatchedSeconds, setLastWatchedSeconds] = useState(0);

  // Derive autoPlay: unauthenticated users always autoplay,
  // authenticated users autoplay only when there's no resume point
  const autoPlay = !isAuthenticated || lastWatchedSeconds === 0;

  // Check watch history and show continue modal
  useEffect(() => {
    if (!watchHistories?.length || !movieItemId) return;

    const watchHistory = watchHistories.find(
      (history) =>
        history.movieItemId === movieItemId && history.lastWatchSeconds > 0
    );

    if (watchHistory) {
      setLastWatchedSeconds(watchHistory.lastWatchSeconds);
      showContinueModal();
    } else {
      setLastWatchedSeconds(0);
    }
  }, [movieItemId, watchHistories, showContinueModal]);

  const handleContinueWatching = () => {
    if (playerRef.current && lastWatchedSeconds > 0) {
      playerRef.current.currentTime = lastWatchedSeconds;
    }
    closeContinueModal();
    playerRef.current?.play();
  };

  const handleStartOver = () => {
    if (!playerRef.current) {
      closeContinueModal();
      return;
    }

    if (skipIntro && typeof video?.introEnd === 'number') {
      const introStartTime = video.introStart ?? 0;
      // If intro starts at 0, skip past it immediately
      if (introStartTime === 0) {
        playerRef.current.currentTime = video.introEnd;
        onIntroSkipped();
      } else {
        playerRef.current.currentTime = 0;
      }
    } else {
      playerRef.current.currentTime = 0;
    }

    closeContinueModal();
    playerRef.current?.play();
  };

  return {
    isShowContinueModal,
    lastWatchedSeconds,
    autoPlay,
    handleContinueWatching,
    handleStartOver
  };
};

export default useContinueWatching;
