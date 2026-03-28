import { useAuth, useGetAnonymousToken, useNavigate } from '@/hooks';
import {
  useWatchHistoryTrackingMutation,
  useWatchHistoryListQuery
} from '@/queries';
import { useMovieStore } from '@/store';
import { useCallback, useMemo, useReducer, useRef } from 'react';
import { useShallow } from 'zustand/shallow';
import type {
  MediaTimeUpdateEventDetail,
  MediaPlayerInstance
} from '@vidstack/react';
import usePlayerSettings from './use-player-settings';
import useWatchHistory from './use-watch-history';
import useIntroSkip from './use-intro-skip';
import useContinueWatching from './use-continue-watching';
import useWatchPlayerData from './use-watch-player-data';
import useEpisodeNavigation from './use-episode-navigation';

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

const useWatchPlayer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));
  const { token, isLoadingToken } = useGetAnonymousToken();

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
    () => watchHistoryData?.data?.watchHistories || [],
    [watchHistoryData?.data?.watchHistories]
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

  // — Combined time update handler (position tracking + intro skip)
  const handleWatchHistoryTimeUpdate = useCallback(
    (detail: MediaTimeUpdateEventDetail) => {
      currentSecondsRef.current = Math.floor(detail.currentTime || 0);
      handleTimeUpdate(detail);
    },
    [handleTimeUpdate]
  );

  return {
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
  };
};

export default useWatchPlayer;
