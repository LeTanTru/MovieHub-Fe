'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  useRef
} from 'react';
import { useAuth, useAnonymousToken, useNavigate, useMovie } from '@/hooks';
import {
  useWatchHistoryTrackingMutation,
  useWatchHistoryListQuery
} from '@/queries';
import type {
  MediaTimeUpdateEventDetail,
  MediaPlayerInstance
} from '@vidstack/react';
import {
  useContinueWatching,
  useEpisodeNavigation,
  useIntroSkip,
  useOutroSkip,
  usePlayerSettings,
  useWatchHistory,
  useWatchPlayerData
} from '@/app/watch/[slug]/_hooks';
import { MovieResType, VideoResType } from '@/types';

type PlaybackState = {
  introSkipped: boolean;
};

type PlaybackAction =
  | { type: 'SET_INTRO_SKIPPED'; value: boolean }
  | { type: 'RESET_INTRO' };

function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction
): PlaybackState {
  switch (action.type) {
    case 'SET_INTRO_SKIPPED':
      return { ...state, introSkipped: action.value };
    case 'RESET_INTRO':
      return { ...state, introSkipped: false };
    default:
      return state;
  }
}

type WatchPlayerContextType = {
  movie: MovieResType | null;
  videoTitle: string;
  video: VideoResType | null | undefined;
  isLoadingToken: boolean;
  autoPlay: boolean;
  token?: string;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  isSeries: boolean;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  handlePrevEpisode: () => void;
  handleNextEpisode: () => void;
  isShowContinueModal: boolean;
  lastWatchedSeconds: number;
  handleContinueWatching: () => void;
  handleStartOver: () => void;
  handleWatchHistoryTimeUpdate: (detail: MediaTimeUpdateEventDetail) => void;
  handleSeeked: (currentTime: number) => void;
  handleVideoEnded: () => void;
  handlePlayerCanPlay: () => void;
  autoNextEpisode: boolean;
  skipIntro: boolean;
  handleToggleAutoNextEpisode: () => void;
  handleToggleSkipIntro: () => void;
};

const WatchPlayerContext = createContext<WatchPlayerContextType | null>(null);

export function WatchPlayerProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { movie } = useMovie();
  const { token, isLoadingToken } = useAnonymousToken();

  const playerRef = useRef<MediaPlayerInstance>(null);
  const currentSecondsRef = useRef<number>(0);

  const [playback, dispatchPlayback] = useReducer(playbackReducer, {
    introSkipped: false
  });

  const { introSkipped } = playback;

  const onIntroSkipped = useCallback(() => {
    dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: true });
  }, []);

  const onEpisodeChange = useCallback(() => {
    dispatchPlayback({ type: 'RESET_INTRO' });
  }, []);

  // — Data
  const {
    isSeries,
    season,
    selectedEpisode,
    episodes,
    currentEpisodeIndex,
    isFirstEpisode,
    isLastEpisode,
    video,
    videoTitle,
    movieItemId
  } = useWatchPlayerData(movie);

  // — Settings
  const {
    autoNextEpisode,
    skipIntro,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro
  } = usePlayerSettings();

  // — Watch history API
  const { mutateAsync: trackWatchHistoryMutate } =
    useWatchHistoryTrackingMutation();

  const { data: watchHistoryData } = useWatchHistoryListQuery({
    params: { movieId: movie?.id || '' },
    enabled: !!movie?.id && isAuthenticated
  });

  const watchHistories = useMemo(
    () => watchHistoryData?.watchHistories || [],
    [watchHistoryData?.watchHistories]
  );

  // — Watch history tracking
  const { handleSeeked } = useWatchHistory({
    movieItemId,
    isAuthenticated,
    currentSecondsRef,
    trackWatchHistoryMutate,
    onEpisodeChange
  });

  // — Intro skip
  const { handlePlayerCanPlay, handleTimeUpdate } = useIntroSkip({
    skipIntro,
    video,
    playerRef,
    introSkipped,
    onIntroSkipped
  });

  // — Continue watching modal
  const {
    isShowContinueModal,
    lastWatchedSeconds,
    autoPlay,
    handleContinueWatching,
    handleStartOver
  } = useContinueWatching({
    movieItemId,
    watchHistories,
    isAuthenticated,
    skipIntro,
    video,
    playerRef,
    onIntroSkipped
  });

  // — Episode navigation
  const { handleVideoEnded, handlePrevEpisode, handleNextEpisode } =
    useEpisodeNavigation({
      autoNextEpisode,
      isSeries,
      isFirstEpisode,
      isLastEpisode,
      season,
      selectedEpisode,
      currentEpisodeIndex,
      episodes,
      movie,
      navigate
    });

  // — Outro skip (auto next episode)
  const { handleTimeUpdate: handleOutroTimeUpdate } = useOutroSkip({
    autoNextEpisode,
    video,
    playerRef,
    isSeries,
    isLastEpisode,
    onNextEpisode: handleNextEpisode
  });

  // — Combined time update handler (position tracking + intro skip + outro skip)
  const handleWatchHistoryTimeUpdate = useCallback(
    (detail: MediaTimeUpdateEventDetail) => {
      currentSecondsRef.current = Math.floor(detail.currentTime || 0);
      handleTimeUpdate(detail);
      handleOutroTimeUpdate(detail);
    },
    [handleTimeUpdate, handleOutroTimeUpdate]
  );
  return (
    <WatchPlayerContext.Provider
      value={{
        movie,
        videoTitle,
        video,
        isLoadingToken,
        autoPlay,
        token,
        playerRef,
        isSeries,
        isFirstEpisode,
        isLastEpisode,
        handlePrevEpisode,
        handleNextEpisode,
        isShowContinueModal,
        lastWatchedSeconds,
        handleContinueWatching,
        handleStartOver,
        handleWatchHistoryTimeUpdate,
        handleSeeked,
        handleVideoEnded,
        handlePlayerCanPlay,
        autoNextEpisode,
        skipIntro,
        handleToggleAutoNextEpisode,
        handleToggleSkipIntro
      }}
    >
      {children}
    </WatchPlayerContext.Provider>
  );
}

export const useWatchPlayer = () => {
  const context = useContext(WatchPlayerContext);
  if (!context) {
    throw new Error('useWatchPlayer must be used within a WatchPlayerProvider');
  }
  return context;
};
