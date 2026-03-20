'use client';

import './watch-player.css';
import { MOVIE_TYPE_SERIES, MOVIE_TYPE_SINGLE, storageKeys } from '@/constants';
import {
  useAuth,
  useDisclosure,
  useGetAnonymousToken,
  useNavigate,
  useQueryParams
} from '@/hooks';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { setData, getData } from '@/utils';
import { useEffect, useRef, useCallback, useMemo, useReducer } from 'react';
import { useShallow } from 'zustand/shallow';
import {
  useWatchHistoryTrackingMutation,
  useWatchHistoryListQuery
} from '@/queries';
import type {
  MovieItemResType,
  MovieResType,
  VideoResType,
  WatchHistoryType
} from '@/types';
import type {
  MediaTimeUpdateEventDetail,
  MediaPlayerInstance
} from '@vidstack/react';
import {
  WatchPlayerControls,
  WatchPlayerHeader,
  WatchPlayerVideoArea
} from '@/components/app/watch';

type PlayerSettings = {
  autoNextEpisode: boolean;
  skipIntro: boolean;
};

type PlayerSettingsAction =
  | { type: 'TOGGLE_AUTO_NEXT_EPISODE' }
  | { type: 'TOGGLE_SKIP_INTRO' }
  | { type: 'LOAD_SETTINGS'; payload: PlayerSettings };

type PlaybackState = {
  lastWatchedSeconds: number;
  autoPlay: boolean;
  introSkipped: boolean;
};

type PlaybackAction =
  | { type: 'SET_LAST_WATCHED'; seconds: number }
  | { type: 'SET_AUTO_PLAY'; value: boolean }
  | { type: 'SET_INTRO_SKIPPED'; value: boolean }
  | { type: 'RESET_SESSION' };

function playerSettingsReducer(
  state: PlayerSettings,
  action: PlayerSettingsAction
): PlayerSettings {
  switch (action.type) {
    case 'TOGGLE_AUTO_NEXT_EPISODE':
      return { ...state, autoNextEpisode: !state.autoNextEpisode };
    case 'TOGGLE_SKIP_INTRO':
      return { ...state, skipIntro: !state.skipIntro };
    case 'LOAD_SETTINGS':
      return action.payload;
    default:
      return state;
  }
}

function playbackReducer(
  state: PlaybackState,
  action: PlaybackAction
): PlaybackState {
  switch (action.type) {
    case 'SET_LAST_WATCHED':
      return { ...state, lastWatchedSeconds: action.seconds };
    case 'SET_AUTO_PLAY':
      return { ...state, autoPlay: action.value };
    case 'SET_INTRO_SKIPPED':
      return { ...state, introSkipped: action.value };
    case 'RESET_SESSION':
      return { ...state, introSkipped: false };
    default:
      return state;
  }
}

type WatchPlayerDerivedData = {
  isSeries: boolean;
  season: MovieResType['seasons'][number] | null;
  selectedEpisode: MovieItemResType | null;
  episodes: MovieItemResType[];
  currentEpisodeIndex: number;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  video: VideoResType | null | undefined;
  videoTitle: string;
  movieItemId: string | undefined;
};

function useWatchPlayerDerivedData(
  movie: MovieResType | null
): WatchPlayerDerivedData {
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const season = (() => {
    if (!movie?.seasons?.length) return null;
    if (!currentSeason) return movie.seasons[movie.seasons.length - 1];
    return (
      movie.seasons.find((item) => item.label === currentSeason) ||
      movie.seasons[movie.seasons.length - 1]
    );
  })();

  const selectedEpisode = (() => {
    if (!isSeries) return null;
    const episodeList = (season?.episodes || []) as MovieItemResType[];
    if (!episodeList.length) return null;
    if (!currentEpisode) return episodeList[episodeList.length - 1];
    return (
      episodeList.find((item) => item.label === currentEpisode) ||
      episodeList[episodeList.length - 1]
    );
  })();

  const episodes = useMemo(
    () => (season?.episodes || []) as MovieItemResType[],
    [season?.episodes]
  );

  const currentEpisodeIndex = (() => {
    if (!selectedEpisode || !episodes.length) return -1;
    return episodes.findIndex((ep) => ep.label === selectedEpisode.label);
  })();

  const isFirstEpisode = currentEpisodeIndex === 0;
  const isLastEpisode = currentEpisodeIndex === episodes.length - 1;

  const video = (() => {
    if (isSeries) return selectedEpisode?.video;
    if (isSingle) return season?.video;
    return season?.video || selectedEpisode?.video || null;
  })();

  const videoTitle = (() => {
    if (!movie) return '';
    if (isSeries && season && selectedEpisode) {
      return `${season.title} - Phần ${season.label} - Tập ${selectedEpisode.label}. ${selectedEpisode.title}`;
    }
    return `${movie.title} - ${movie.originalTitle}`;
  })();

  const movieItemId = isSeries ? selectedEpisode?.id : season?.id;

  return {
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
  };
}

function useEpisodeNavigation({
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
}: {
  autoNextEpisode: boolean;
  isSeries: boolean;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  season: MovieResType['seasons'][number] | null;
  selectedEpisode: MovieItemResType | null;
  currentEpisodeIndex: number;
  episodes: MovieItemResType[];
  movie: MovieResType | null;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const buildEpisodeUrl = useCallback(
    (episodeLabel: string) => {
      if (!season || !movie) return '';
      return `${route.watch.path}/${movie.slug}.${movie.id}?season=${season.label}&episode=${episodeLabel}`;
    },
    [season, movie]
  );

  const handleVideoEnded = useCallback(() => {
    if (
      !autoNextEpisode ||
      !isSeries ||
      isLastEpisode ||
      !season ||
      !selectedEpisode
    ) {
      return;
    }

    const nextEpisode = episodes[currentEpisodeIndex + 1];
    if (!nextEpisode) return;
    const nextUrl = buildEpisodeUrl(nextEpisode.label);
    if (nextUrl) navigate.replace(nextUrl);
  }, [
    autoNextEpisode,
    isSeries,
    isLastEpisode,
    season,
    selectedEpisode,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  const handlePrevEpisode = useCallback(() => {
    if (!isSeries || isFirstEpisode || !season || !movie) return;
    const prevEpisode = episodes[currentEpisodeIndex - 1];
    if (!prevEpisode) return;
    const prevUrl = buildEpisodeUrl(prevEpisode.label);
    if (prevUrl) navigate.replace(prevUrl);
  }, [
    isSeries,
    isFirstEpisode,
    season,
    movie,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  const handleNextEpisode = useCallback(() => {
    if (!isSeries || isLastEpisode || !season || !movie) return;
    const nextEpisode = episodes[currentEpisodeIndex + 1];
    if (!nextEpisode) return;
    const nextUrl = buildEpisodeUrl(nextEpisode.label);
    if (nextUrl) navigate.replace(nextUrl);
  }, [
    isSeries,
    isLastEpisode,
    season,
    movie,
    episodes,
    currentEpisodeIndex,
    buildEpisodeUrl,
    navigate
  ]);

  return { handleVideoEnded, handlePrevEpisode, handleNextEpisode };
}

function useWatchPlayerState() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  const { token, isLoadingToken } = useGetAnonymousToken();

  const [settings, dispatchSettings] = useReducer(playerSettingsReducer, {
    autoNextEpisode: false,
    skipIntro: false
  });

  const [playback, dispatchPlayback] = useReducer(playbackReducer, {
    lastWatchedSeconds: 0,
    autoPlay: false,
    introSkipped: false
  });

  const { autoNextEpisode, skipIntro } = settings;
  const { lastWatchedSeconds, autoPlay, introSkipped } = playback;

  const currentSecondsRef = useRef<number>(0);
  const playerRef = useRef<MediaPlayerInstance>(null);

  const {
    opened: isShowContinueModal,
    open: showContinueModal,
    close: closeContinueModal
  } = useDisclosure();

  const { mutateAsync: trackWatchHistoryMutate } =
    useWatchHistoryTrackingMutation();

  // Fetch watch history for current movie
  const { data: watchHistoryData } = useWatchHistoryListQuery({
    params: { movieId: movie?.id || '' },
    enabled: !!movie?.id && isAuthenticated
  });

  const watchHistories = useMemo(
    () => watchHistoryData?.data?.watchHistories || [],
    [watchHistoryData?.data?.watchHistories]
  );

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
  } = useWatchPlayerDerivedData(movie);

  // Load settings from localStorage on mount
  useEffect(() => {
    dispatchSettings({
      type: 'LOAD_SETTINGS',
      payload: {
        autoNextEpisode:
          getData(storageKeys.WATCH_AUTO_NEXT_EPISODE) === 'true',
        skipIntro: getData(storageKeys.WATCH_SKIP_INTRO) === 'true'
      }
    });
  }, []);

  // Toggle auto next episode
  const handleToggleAutoNextEpisode = () => {
    dispatchSettings({ type: 'TOGGLE_AUTO_NEXT_EPISODE' });
    setData(storageKeys.WATCH_AUTO_NEXT_EPISODE, String(!autoNextEpisode));
  };

  // Toggle skip intro
  const handleToggleSkipIntro = () => {
    dispatchSettings({ type: 'TOGGLE_SKIP_INTRO' });
    setData(storageKeys.WATCH_SKIP_INTRO, String(!skipIntro));
  };

  // Track current position (no API calls during playback)
  const handleWatchHistoryTimeUpdate = (detail: MediaTimeUpdateEventDetail) => {
    currentSecondsRef.current = Math.floor(detail.currentTime || 0);

    // Handle skip intro
    if (skipIntro && typeof video?.introEnd === 'number' && !introSkipped) {
      const currentTime = detail.currentTime || 0;
      const introStartTime = video.introStart ?? 0;
      if (currentTime >= introStartTime && currentTime < video.introEnd) {
        if (playerRef.current) {
          playerRef.current.currentTime = video.introEnd;
        }
        dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: true });
      }
    }
  };

  // Save watch history when leaving video page
  const saveWatchHistory = useCallback(async () => {
    if (!movieItemId || currentSecondsRef.current <= 0) return;

    const payload: WatchHistoryType = {
      lastWatchSeconds: currentSecondsRef.current,
      movieItemId: movieItemId
    };

    if (!isAuthenticated) return;

    await trackWatchHistoryMutate(payload);
  }, [isAuthenticated, movieItemId, trackWatchHistoryMutate]);

  // Track when user seeks (clicks on time slider)
  const handleSeeked = (currentTime: number) => {
    currentSecondsRef.current = Math.floor(currentTime || 0);
    saveWatchHistory();
  };

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

  // Track when user leaves page (beforeunload, navigation, etc)
  useEffect(() => {
    const handleBeforeUnload = async () => {
      await saveWatchHistory();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveWatchHistory();
    };
  }, [movieItemId, saveWatchHistory, trackWatchHistoryMutate]);

  // Track when episode/movie item changes
  useEffect(() => {
    saveWatchHistory().then(() => {
      currentSecondsRef.current = 0;
      dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: false });
    });
  }, [movieItemId, saveWatchHistory]);

  // Check watch history and show continue modal
  useEffect(() => {
    if (!watchHistories || !movieItemId) return;

    const watchHistory = watchHistories.find(
      (history) =>
        history.movieItemId === movieItemId && history.lastWatchSeconds > 0
    );

    if (watchHistory) {
      dispatchPlayback({
        type: 'SET_LAST_WATCHED',
        seconds: watchHistory.lastWatchSeconds
      });
      showContinueModal();
    }
  }, [movieItemId, showContinueModal, watchHistories]);

  useEffect(() => {
    if (!isAuthenticated) {
      dispatchPlayback({ type: 'SET_AUTO_PLAY', value: true });
      return;
    }

    dispatchPlayback({
      type: 'SET_AUTO_PLAY',
      value: lastWatchedSeconds === 0
    });
  }, [isAuthenticated, lastWatchedSeconds]);

  const handleContinueWatching = () => {
    if (playerRef.current && lastWatchedSeconds > 0) {
      playerRef.current.currentTime = lastWatchedSeconds;
    }
    dispatchPlayback({ type: 'SET_AUTO_PLAY', value: true });
    closeContinueModal();
    playerRef.current?.play();
  };

  const handleStartOver = () => {
    if (playerRef.current) {
      // If skip intro is enabled and video starts in intro range, skip to intro end
      if (skipIntro && typeof video?.introEnd === 'number') {
        const introStartTime = video.introStart ?? 0;
        if (introStartTime === 0) {
          playerRef.current.currentTime = video.introEnd;
          dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: true });
        } else {
          playerRef.current.currentTime = 0;
        }
      } else {
        playerRef.current.currentTime = 0;
      }
    }
    dispatchPlayback({ type: 'SET_AUTO_PLAY', value: true });
    closeContinueModal();
    playerRef.current?.play();
  };

  // Handle player ready - skip intro immediately if enabled
  const introStart = video?.introStart;
  const introEnd = video?.introEnd;

  const handlePlayerCanPlay = useCallback(() => {
    if (
      !skipIntro ||
      !playerRef.current ||
      typeof introEnd !== 'number' ||
      introSkipped
    ) {
      return;
    }

    const currentTime = playerRef.current.currentTime;
    const introStartTime = introStart ?? 0;

    if (currentTime >= introStartTime && currentTime < introEnd) {
      playerRef.current.currentTime = introEnd;
      dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: true });
    }
  }, [skipIntro, introStart, introEnd, introSkipped]);

  // Auto-skip intro when skipIntro setting is enabled and player is ready
  useEffect(() => {
    if (
      !skipIntro ||
      !playerRef.current ||
      typeof video?.introEnd !== 'number' ||
      introSkipped
    ) {
      return;
    }

    // Use a small timeout to ensure player is fully ready
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const introStartTime = video.introStart ?? 0;

      // Skip intro if at the beginning and intro is enabled
      if (currentTime >= introStartTime && currentTime < video.introEnd) {
        playerRef.current.currentTime = video.introEnd;
        dispatchPlayback({ type: 'SET_INTRO_SKIPPED', value: true });
      }
    }
  }, [skipIntro, video?.introEnd, video?.introStart, introSkipped]);

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
}

export default function WatchPlayer() {
  const state = useWatchPlayerState();

  if (!state.movie) return null;

  return (
    <div className='watch-player max-800:max-w-none max-800:w-full max-800:px-0 max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410 px-5'>
      <WatchPlayerHeader movie={state.movie} videoTitle={state.videoTitle} />
      <div className='watch-player-container'>
        <WatchPlayerVideoArea
          video={state.video}
          isLoadingToken={state.isLoadingToken}
          autoPlay={state.autoPlay}
          token={state.token}
          videoTitle={state.videoTitle}
          movie={state.movie}
          playerRef={state.playerRef}
          episode={{
            isSeries: state.isSeries,
            isFirstEpisode: state.isFirstEpisode,
            isLastEpisode: state.isLastEpisode,
            onPrev: state.handlePrevEpisode,
            onNext: state.handleNextEpisode
          }}
          continueModal={{
            isOpen: state.isShowContinueModal,
            lastWatchedSeconds: state.lastWatchedSeconds,
            onContinue: state.handleContinueWatching,
            onStartOver: state.handleStartOver
          }}
          callbacks={{
            onTimeUpdate: state.handleWatchHistoryTimeUpdate,
            onSeeked: state.handleSeeked,
            onEnded: state.handleVideoEnded,
            onCanPlay: state.handlePlayerCanPlay
          }}
        />
        <WatchPlayerControls
          movie={state.movie}
          autoNextEpisode={state.autoNextEpisode}
          skipIntro={state.skipIntro}
          handleToggleAutoNextEpisode={state.handleToggleAutoNextEpisode}
          handleToggleSkipIntro={state.handleToggleSkipIntro}
        />
      </div>
    </div>
  );
}
