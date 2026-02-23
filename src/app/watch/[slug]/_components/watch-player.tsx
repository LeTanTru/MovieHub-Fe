'use client';

import './watch-player.css';
import { ButtonLike } from '@/components/app/button-like';
import { ButtonShareMovie } from '@/components/app/button-share';
import { VideoPlayer } from '@/components/video-player';
import {
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  VIDEO_SOURCE_TYPE_INTERNAL
} from '@/constants';
import { useAuth, useDisclosure, useQueryParams } from '@/hooks';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FaChevronLeft, FaFlag } from 'react-icons/fa6';
import { CiStreamOn } from 'react-icons/ci';
import { Button } from '@/components/form';
import { getAnonymousToken } from '@/app/actions/anonymous';
import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import { PlaylistIcon } from '@/assets';
import { cn } from '@/lib';
import { useShallow } from 'zustand/shallow';
import {
  useWatchHistoryTrackingMutation,
  useWatchHistoryListQuery
} from '@/queries';
import { WatchHistoryType } from '@/types';
import {
  MediaTimeUpdateEventDetail,
  MediaPlayerInstance
} from '@vidstack/react';
import { EpisodeList, WatchContinueModal } from '@/components/app/watch';
import envConfig from '@/config';

export default function WatchPlayer() {
  const { isAuthenticated } = useAuth();

  const { movie } = useMovieStore(useShallow((s) => ({ movie: s.movie })));

  // Selected season and episode from movie detail page
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const [token, setToken] = useState<string>('');
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);
  const [lastWatchedSeconds, setLastWatchedSeconds] = useState<number>(0);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const currentSecondsRef = useRef<number>(0);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const hasFetchedTokenRef = useRef<boolean>(false);

  const {
    opened: isEpisodeListOpen,
    open: openEpisodeList,
    close: closeEpisodeList
  } = useDisclosure();

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
  const episodes = season?.episodes || [];

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

  // Track current position (no API calls during playback)
  const handleWatchHistoryTimeUpdate = (detail: MediaTimeUpdateEventDetail) => {
    currentSecondsRef.current = Math.floor(detail.currentTime || 0);
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
      setLastWatchedSeconds(watchHistory.lastWatchSeconds);
      showContinueModal();
    }
  }, [movieItemId, showContinueModal, watchHistories]);

  useEffect(() => {
    setAutoPlay(!isAuthenticated || lastWatchedSeconds === 0);
  }, [isAuthenticated, lastWatchedSeconds]);

  const handleContinueWatching = () => {
    if (playerRef.current && lastWatchedSeconds > 0) {
      playerRef.current.currentTime = lastWatchedSeconds;
    }
    setAutoPlay(true);
    closeContinueModal();
    playerRef.current?.play();
  };

  const handleStartOver = () => {
    if (playerRef.current) {
      playerRef.current.currentTime = 0;
    }
    setAutoPlay(true);
    closeContinueModal();
    playerRef.current?.play();
  };

  useEffect(() => {
    if (hasFetchedTokenRef.current) return;
    hasFetchedTokenRef.current = true;

    const handleGetToken = async () => {
      const anonymousToken = await getAnonymousToken();
      setToken(anonymousToken?.access_token || '');
      setIsLoadingToken(false);
    };

    handleGetToken();

    const interval = setInterval(handleGetToken, 14 * 60 * 1000); // Refresh token every 14 minutes

    return () => clearInterval(interval);
  }, []);

  if (!movie) return null;

  return (
    <div className='watch-player relative z-3 mx-auto max-w-410 px-5'>
      <div className='mb-6 inline-flex w-full items-center gap-2 px-8'>
        <Link
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
          className='mr-2 rounded-full border border-solid border-gray-200 p-2 transition-all duration-200 ease-linear hover:opacity-80'
        >
          <FaChevronLeft />
        </Link>
        <h3 className='text-xl font-bold'>Xem phim {videoTitle}</h3>
      </div>
      {video ? (
        <div className='relative aspect-video w-full overflow-hidden rounded-tl-[6px] rounded-tr-[6px]'>
          {isLoadingToken ? (
            <div className='flex h-full w-full items-center justify-center bg-black'>
              <div className='h-12 w-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent'></div>
            </div>
          ) : (
            <>
              <VideoPlayer
                ref={playerRef}
                auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL}
                duration={video.duration}
                introEnd={video.introEnd}
                introStart={video.introStart}
                source={renderVideoUrl(video.content)}
                thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
                vttUrl={renderVttUrl(video.vttUrl)}
                outroStart={video.outroStart}
                token={token}
                title={videoTitle}
                className='w-full'
                autoPlay={autoPlay}
                slots={{
                  topControlsGroupStart: (
                    <span className='text-base font-medium'>{videoTitle}</span>
                  ),
                  topControlsGroupEnd: isSeries ? (
                    <Button
                      variant='ghost'
                      className={cn(
                        `hover:text-golden-glow font-medium! hover:bg-transparent!`,
                        {
                          'text-golden-glow': isEpisodeListOpen
                        }
                      )}
                      onClick={openEpisodeList}
                    >
                      <PlaylistIcon className='h-6! w-6!' />
                      Danh sách tập
                    </Button>
                  ) : null
                }}
                volume={
                  envConfig.NEXT_PUBLIC_NODE_ENV === 'development' ? 0 : 0.5
                }
                prev={isSeries && !isFirstEpisode}
                next={isSeries && !isLastEpisode}
                onPrevClick={() => console.log('prev')}
                onNextClick={() => console.log('next')}
                onTimeUpdate={handleWatchHistoryTimeUpdate}
                onSeeked={handleSeeked}
              />
              <WatchContinueModal
                opened={isShowContinueModal}
                lastWatchedSeconds={lastWatchedSeconds}
                onClose={closeContinueModal}
                onContinueWatching={handleContinueWatching}
                onStartOver={handleStartOver}
              />
            </>
          )}
          {isSeries && (
            <EpisodeList
              seasons={movie.seasons}
              isOpen={isEpisodeListOpen}
              onToggle={closeEpisodeList}
            />
          )}
        </div>
      ) : (
        <div className='aspect-video rounded-tl rounded-tr bg-black'>
          <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400'>
            Video cho phim này đang được cập nhật. Vui lòng quay lại sau.
          </p>
        </div>
      )}
      <div className='bg-covert-black flex h-16 items-center rounded-br-[12px] rounded-bl-[12px]'>
        <div className='flex w-full items-center gap-2 px-4 select-none'>
          <ButtonLike targetId={movie.id} variant='watch' text='Yêu thích' />
          <ButtonAddToPlaylist movieId={movie.id} variant='watch' />
          <Button
            variant='ghost'
            className='hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Chuyển tập
            <span className='group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <Button
            variant='ghost'
            className='hover:text-golden-glow group flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Bỏ qua giới thiệu
            <span className='group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <Button
            variant='ghost'
            className='hover:text-golden-glow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Rạp phim
            <span className='group-hover:border-golden-glow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <ButtonShareMovie variant='watch' />
          <Button
            variant='ghost'
            className='hover:text-golden-glow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <CiStreamOn className='size-5' />
            Xem chung
          </Button>
          <div className='grow'></div>
          <Button
            variant='ghost'
            className='hover:text-golden-glow flex h-10! items-center justify-center gap-2 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <FaFlag /> Báo lỗi
          </Button>
        </div>
      </div>
    </div>
  );
}
