'use client';

import './watch-player.css';
import { ButtonLikeWatch } from '@/components/app/button-like';
import { ButtonShareMovie } from '@/components/app/button-share';
import { VideoPlayer } from '@/components/video-player';
import {
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  VIDEO_SOURCE_TYPE_INTERNAL
} from '@/constants';
import { useDisclosure, useQueryParams } from '@/hooks';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaChevronLeft, FaFlag } from 'react-icons/fa6';
import { CiStreamOn } from 'react-icons/ci';
import { Button } from '@/components/form';
import { getAnonymousToken } from '@/app/actions/anonymous';
import { ButtonAddToPlaylist } from '@/components/app/button-add-to-playlist';
import EpisodeList from './episode-list';
import { PlaylistIcon } from '@/assets';
import { cn } from '@/lib';
import { useShallow } from 'zustand/shallow';

export default function WatchPlayer() {
  const { movie } = useMovieStore(
    useShallow((s) => ({
      movie: s.movie
    }))
  );

  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const [token, setToken] = useState<string>('');
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true);

  const {
    opened: isEpisodeListOpen,
    open: openEpisodeList,
    close: closeEpisodeList
  } = useDisclosure();

  const currentSeason = searchParams.season;
  const currentEpisode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const season = (() => {
    if (!movie?.seasons?.length) return null;
    // If not season in search params, default to last season
    if (!currentSeason) return movie.seasons[movie.seasons.length - 1];

    // If not season and episode in search params, default to lastest episode of the season
    return (
      movie.seasons.find((item) => item.label === currentSeason) ||
      movie.seasons[movie.seasons.length - 1]
    );
  })();

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

  useEffect(() => {
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
      <div className='mb-6 inline-flex w-full items-center gap-2 px-10'>
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
            <VideoPlayer
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
              slots={{
                topControlsGroupStart: (
                  <span className='text-base font-medium'>{videoTitle}</span>
                ),
                topControlsGroupEnd: isSeries ? (
                  <Button
                    variant='ghost'
                    className={cn(
                      `hover:text-light-golden-yellow font-medium! hover:bg-transparent!`,
                      {
                        'text-light-golden-yellow': isEpisodeListOpen
                      }
                    )}
                    onClick={openEpisodeList}
                  >
                    <PlaylistIcon className='h-6! w-6!' />
                    Danh sách tập
                  </Button>
                ) : null
              }}
              prev={isSeries && !isFirstEpisode}
              next={isSeries && !isLastEpisode}
              onPrevClick={() => console.log('prev')}
              onNextClick={() => console.log('next')}
              autoPlay={false}
            />
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
      <div className='flex h-16 items-center rounded-br-[12px] rounded-bl-[12px] bg-[#15151a]'>
        <div className='flex w-full items-center gap-2 px-4 select-none'>
          <ButtonLikeWatch
            targetId={movie.id}
            className='h-10! hover:bg-white/10!'
            text='Yêu thích'
          />
          <ButtonAddToPlaylist
            movieId={movie.id}
            className='hover:text-light-golden-yellow flex h-10! flex-row items-center justify-center gap-2 px-4! py-2.5 text-sm whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          />
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Chuyển tập
            <span className='group-hover:border-light-golden-yellow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow group flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Bỏ qua giới thiệu
            <span className='group-hover:border-light-golden-yellow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow group flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Rạp phim
            <span className='group-hover:border-light-golden-yellow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <ButtonShareMovie className='hover:text-light-golden-yellow flex h-10! flex-row items-center justify-center gap-2 px-4! py-2 text-sm whitespace-nowrap transition-all duration-200 ease-linear' />
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <CiStreamOn className='size-5' />
            Xem chung
          </Button>
          <div className='grow'></div>
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <FaFlag /> Báo lỗi
          </Button>
        </div>
      </div>
    </div>
  );
}
