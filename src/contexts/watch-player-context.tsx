'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  useRef
} from 'react';
import {
  useAuth,
  useAnonymousToken,
  useNavigate,
  useMovie,
  useContinueWatching,
  useEpisodeNavigation,
  useIntroSkip,
  useOutroSkip,
  usePlayerSettings,
  useWatchHistory,
  useWatchPlayerData
} from '@/hooks';
import {
  useWatchHistoryTrackingMutation,
  useWatchHistoryListQuery
} from '@/queries';
import type {
  MediaTimeUpdateEventDetail,
  MediaPlayerInstance
} from '@vidstack/react';
import type { MovieResType, VideoResType } from '@/types';

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
  audio: number;
  autoNextEpisode: boolean;
  autoPlay: boolean;
  brightness: number;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  isLoadingToken: boolean;
  isSeries: boolean;
  isShowContinueModal: boolean;
  lastWatchedSeconds: number;
  movie: MovieResType | null;
  playbackSpeed: number;
  playerRef: React.RefObject<MediaPlayerInstance | null>;
  resolution: number;
  skipIntro: boolean;
  subtitleBackgroundColor: number;
  subtitleEnabled: boolean;
  subtitleFontSize: number;
  subtitleTextColor: number;
  token?: string;
  video: VideoResType | null | undefined;
  videoTitle: string;
  handleChangeAudio: (value: number) => void;
  handleChangeBrightness: (value: number) => void;
  handleChangePlaybackSpeed: (value: number) => void;
  handleChangeResolution: (value: number) => void;
  handleChangeSubtitleBackgroundColor: (value: number) => void;
  handleChangeSubtitleFontSize: (value: number) => void;
  handleChangeSubtitleTextColor: (value: number) => void;
  handleContinueWatching: () => void;
  handleNextEpisode: () => void;
  handlePlayerCanPlay: () => void;
  handlePrevEpisode: () => void;
  handleSeeked: (currentTime: number) => void;
  handleStartOver: () => void;
  handleToggleAutoNextEpisode: () => void;
  handleToggleSkipIntro: () => void;
  handleToggleSubtitleEnabled: () => void;
  handleVideoEnded: () => void;
  handleWatchHistoryTimeUpdate: (detail: MediaTimeUpdateEventDetail) => void;
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
    audio,
    autoNextEpisode,
    brightness,
    playbackSpeed,
    resolution,
    skipIntro,
    subtitleBackgroundColor,
    subtitleEnabled,
    subtitleFontSize,
    subtitleTextColor,
    handleChangeAudio,
    handleChangeBrightness,
    handleChangePlaybackSpeed,
    handleChangeResolution,
    handleChangeSubtitleBackgroundColor,
    handleChangeSubtitleFontSize,
    handleChangeSubtitleTextColor,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro,
    handleToggleSubtitleEnabled
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
        audio,
        autoNextEpisode,
        autoPlay,
        brightness,
        isFirstEpisode,
        isLastEpisode,
        isLoadingToken,
        isSeries,
        isShowContinueModal,
        lastWatchedSeconds,
        movie,
        playbackSpeed,
        playerRef,
        resolution,
        skipIntro,
        subtitleBackgroundColor,
        subtitleEnabled,
        subtitleFontSize,
        subtitleTextColor,
        token,
        video,
        videoTitle,
        handleChangeAudio,
        handleChangeBrightness,
        handleChangePlaybackSpeed,
        handleChangeResolution,
        handleChangeSubtitleBackgroundColor,
        handleChangeSubtitleFontSize,
        handleChangeSubtitleTextColor,
        handleContinueWatching,
        handleNextEpisode,
        handlePlayerCanPlay,
        handlePrevEpisode,
        handleSeeked,
        handleStartOver,
        handleToggleAutoNextEpisode,
        handleToggleSkipIntro,
        handleToggleSubtitleEnabled,
        handleVideoEnded,
        handleWatchHistoryTimeUpdate
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
