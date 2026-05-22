import { useCallback, useEffect, useRef } from 'react';
import type { VideoResType } from '@/types';
import type {
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail
} from '@vidstack/react';

type UseOutroSkipProps = {
  autoNextEpisode: boolean;
  video: VideoResType | null | undefined;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  isSeries: boolean;
  isLastEpisode: boolean;
  onNextEpisode: () => void;
};

export const useOutroSkip = ({
  autoNextEpisode,
  video,
  playerRef,
  isSeries,
  isLastEpisode,
  onNextEpisode
}: UseOutroSkipProps) => {
  const outroStart = video?.outroStart;
  const hasNavigatedRef = useRef(false);

  const tryAutoNextEpisode = useCallback(
    (currentTime: number) => {
      if (
        !autoNextEpisode ||
        !isSeries ||
        isLastEpisode ||
        typeof outroStart !== 'number' ||
        outroStart <= 0 ||
        !playerRef.current
      )
        return;

      if (currentTime >= outroStart && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        onNextEpisode();
      }
    },
    [
      autoNextEpisode,
      isSeries,
      isLastEpisode,
      outroStart,
      playerRef,
      onNextEpisode
    ]
  );

  const handleTimeUpdate = useCallback(
    (detail: MediaTimeUpdateEventDetail) => {
      tryAutoNextEpisode(detail.currentTime || 0);
    },
    [tryAutoNextEpisode]
  );

  useEffect(() => {
    hasNavigatedRef.current = false;
  }, [video?.id, outroStart]);

  return { handleTimeUpdate };
};
