import { useCallback, useEffect } from 'react';
import type { VideoResType } from '@/types';
import type {
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail
} from '@vidstack/react';

type UseIntroSkipProps = {
  skipIntro: boolean;
  video: VideoResType | null | undefined;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  introSkipped: boolean;
  onIntroSkipped: () => void;
};

const useIntroSkip = ({
  skipIntro,
  video,
  playerRef,
  introSkipped,
  onIntroSkipped
}: UseIntroSkipProps) => {
  const introStart = video?.introStart;
  const introEnd = video?.introEnd;

  const trySkipIntro = useCallback(
    (currentTime: number) => {
      if (
        !skipIntro ||
        typeof introEnd !== 'number' ||
        introSkipped ||
        !playerRef.current
      )
        return;

      const introStartTime = introStart ?? 0;

      if (currentTime >= introStartTime && currentTime < introEnd) {
        playerRef.current.currentTime = introEnd;
        onIntroSkipped();
      }
    },
    [skipIntro, introStart, introEnd, introSkipped, playerRef, onIntroSkipped]
  );

  // Try skipping when player becomes ready
  const handlePlayerCanPlay = useCallback(() => {
    if (!playerRef.current) return;
    trySkipIntro(playerRef.current.currentTime);
  }, [playerRef, trySkipIntro]);

  // Try skipping on every time update during playback
  const handleTimeUpdate = useCallback(
    (detail: MediaTimeUpdateEventDetail) => {
      trySkipIntro(detail.currentTime || 0);
    },
    [trySkipIntro]
  );

  // Re-attempt skip when skipIntro setting is toggled on
  useEffect(() => {
    if (!playerRef.current) return;
    trySkipIntro(playerRef.current.currentTime);
  }, [skipIntro, trySkipIntro]); // eslint-disable-line react-hooks/exhaustive-deps

  return { handlePlayerCanPlay, handleTimeUpdate };
};

export default useIntroSkip;
