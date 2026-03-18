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
import type { WatchHistoryType } from '@/types';
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

export default function WatchPlayer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  // Selected season and episode from movie detail page
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

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

  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE; // if the movie type is single
  const isSeries = movie?.type === MOVIE_TYPE_SERIES; // if the movie type is series

  // Get the season of the movie, if not season in search params, default to the latest season
  const season = (() => {
    // Not found any season, return null
    if (!movie?.seasons?.length) return null;

    // If not season in search params, default to the lastest season
    if (!currentSeason) return movie.seasons[movie.seasons.length - 1];

    // Find season by label, if not found, default to the lastest season
    return (
      movie.seasons.find((item) => item.label === currentSeason) ||
      movie.seasons[movie.seasons.length - 1]
    );
  })();

  // Get the episode of the season, if not episode in search params, default to the latest episode
  const selectedEpisode = (() => {
    if (!isSeries) return null;
    const episodes = season?.episodes || [];
    if (!episodes.length) return null;
    // If not episode in search params, default to lastest episode
    if (!currentEpisode) return episodes[episodes.length - 1];

    // Find episode by label, if not found, default to lastest episode
    return (
      episodes.find((item) => item.label === currentEpisode) ||
      episodes[episodes.length - 1]
    );
  })();

  // Episodes of current season, if not season, return empty array
  const episodes = useMemo(() => season?.episodes || [], [season?.episodes]);

  // Find index of current episode in episodes array, if not found, return -1
  const currentEpisodeIndex = (() => {
    if (!selectedEpisode || !episodes.length) return -1;
    return episodes.findIndex((ep) => ep.label === selectedEpisode.label);
  })();

  const isFirstEpisode = currentEpisodeIndex === 0; // To show prev button
  const isLastEpisode = currentEpisodeIndex === episodes.length - 1; // To show next button

  // Get video to play
  const video = (() => {
    if (isSeries) return selectedEpisode?.video;
    if (isSingle) return season?.video;
    return season?.video || selectedEpisode?.video || null;
  })();

  // Build video title
  const videoTitle = (() => {
    if (!movie) return '';
    if (isSeries && season && selectedEpisode) {
      return `${season.title} - Phần ${season.label} - Tập ${selectedEpisode.label}. ${selectedEpisode.title}`;
    }
    return `${movie.title} - ${movie.originalTitle}`;
  })();

  const movieItemId = isSeries ? selectedEpisode?.id : season?.id;

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

  // Handle video ended - auto play next episode if enabled
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

    const nextEpisodeIndex = currentEpisodeIndex + 1;
    const nextEpisode = episodes[nextEpisodeIndex];

    if (nextEpisode && season && movie) {
      const nextUrl = `${route.watch.path}/${movie.slug}.${movie.id}?season=${season.label}&episode=${nextEpisode.label}`;
      navigate.replace(nextUrl);
    }
  }, [
    autoNextEpisode,
    isSeries,
    isLastEpisode,
    season,
    selectedEpisode,
    currentEpisodeIndex,
    episodes,
    movie,
    navigate
  ]);

  // Handle navigate to previous episode
  const handlePrevEpisode = useCallback(() => {
    if (!isSeries || isFirstEpisode || !season || !movie) return;

    const prevEpisodeIndex = currentEpisodeIndex - 1;
    const prevEpisode = episodes[prevEpisodeIndex];

    if (prevEpisode) {
      const prevUrl = `${route.watch.path}/${movie.slug}.${movie.id}?season=${season.label}&episode=${prevEpisode.label}`;
      navigate.replace(prevUrl);
    }
  }, [
    isSeries,
    isFirstEpisode,
    season,
    movie,
    currentEpisodeIndex,
    episodes,
    navigate
  ]);

  // Handle navigate to next episode
  const handleNextEpisode = useCallback(() => {
    if (!isSeries || isLastEpisode || !season || !movie) return;

    const nextEpisodeIndex = currentEpisodeIndex + 1;
    const nextEpisode = episodes[nextEpisodeIndex];

    if (nextEpisode) {
      const nextUrl = `${route.watch.path}/${movie.slug}.${movie.id}?season=${season.label}&episode=${nextEpisode.label}`;
      navigate.replace(nextUrl);
    }
  }, [
    isSeries,
    isLastEpisode,
    season,
    movie,
    currentEpisodeIndex,
    episodes,
    navigate
  ]);

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

  if (!movie) return null;

  return (
    <div className='watch-player max-800:max-w-none max-800:w-full max-800:px-0 max-640:-mt-10 max-640:flex max-640:flex-col-reverse relative mx-auto max-w-410 px-5'>
      <WatchPlayerHeader movie={movie} videoTitle={videoTitle} />
      <div className='watch-player-container'>
        <WatchPlayerVideoArea
          video={video}
          isLoadingToken={isLoadingToken}
          autoPlay={autoPlay}
          token={token}
          videoTitle={videoTitle}
          movie={movie}
          playerRef={playerRef}
          episode={{
            isSeries,
            isFirstEpisode,
            isLastEpisode,
            onPrev: handlePrevEpisode,
            onNext: handleNextEpisode
          }}
          continueModal={{
            isOpen: isShowContinueModal,
            lastWatchedSeconds,
            onContinue: handleContinueWatching,
            onStartOver: handleStartOver
          }}
          callbacks={{
            onTimeUpdate: handleWatchHistoryTimeUpdate,
            onSeeked: handleSeeked,
            onEnded: handleVideoEnded,
            onCanPlay: handlePlayerCanPlay
          }}
        />
        <WatchPlayerControls
          movie={movie}
          autoNextEpisode={autoNextEpisode}
          skipIntro={skipIntro}
          handleToggleAutoNextEpisode={handleToggleAutoNextEpisode}
          handleToggleSkipIntro={handleToggleSkipIntro}
        />
      </div>
    </div>
  );
}
