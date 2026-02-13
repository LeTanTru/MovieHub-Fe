'use client';

import { ButtonLikeWatch } from '@/components/app/button-like';
import { ButtonShareMovie } from '@/components/app/button-share';
import { VideoPlayer } from '@/components/video-player';
import {
  MOVIE_TYPE_SERIES,
  MOVIE_TYPE_SINGLE,
  VIDEO_SOURCE_TYPE_INTERNAL
} from '@/constants';
import { useQueryParams } from '@/hooks';
import { route } from '@/routes';
import { useMovieStore } from '@/store';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import { getAccessTokenFromLocalStorage } from '@/utils/storage.util';
import Link from 'next/link';
import { useMemo } from 'react';
import { FaChevronLeft, FaFlag, FaPlus } from 'react-icons/fa6';
import { CiStreamOn } from 'react-icons/ci';
import { Button } from '@/components/form';

export default function WatchPlayer() {
  const movie = useMovieStore((s) => s.movie);
  const { searchParams } = useQueryParams<{
    season: string;
    episode: string;
  }>();

  const seasonLabel = searchParams.season;
  const episode = searchParams.episode;
  const isSingle = movie?.type === MOVIE_TYPE_SINGLE;
  const isSeries = movie?.type === MOVIE_TYPE_SERIES;

  const season = useMemo(() => {
    if (!movie?.seasons?.length) return null;
    if (!seasonLabel) return movie.seasons[0];

    return (
      movie.seasons.find((item) => item.label === seasonLabel) ||
      movie.seasons[0]
    );
  }, [movie?.seasons, seasonLabel]);

  const selectedEpisode = useMemo(() => {
    if (!isSeries) return null;
    const episodes = season?.episodes || [];
    if (!episodes.length) return null;
    if (!episode) return episodes[0];

    return episodes.find((item) => item.label === episode) || episodes[0];
  }, [episode, isSeries, season?.episodes]);

  const video = useMemo(() => {
    if (isSeries) return selectedEpisode?.video;
    if (isSingle) return season?.video;
    return season?.video || selectedEpisode?.video || null;
  }, [isSeries, isSingle, season?.video, selectedEpisode?.video]);
  const token = getAccessTokenFromLocalStorage() || '';

  if (!movie) return null;

  return (
    <div className='relative z-3 mx-auto max-w-410 px-5'>
      <div className='mb-6 inline-flex w-full items-center gap-2 px-10'>
        <Link
          href={`${route.movie.path}/${movie.slug}.${movie.id}`}
          className='mr-2 rounded-full border border-solid border-gray-200 p-2 transition-all duration-200 ease-linear hover:opacity-80'
        >
          <FaChevronLeft />
        </Link>
        <h3 className='text-xl font-bold'>
          Xem phim {movie.title} - {movie.originalTitle}
        </h3>
      </div>
      {video ? (
        <div className='aspect-video w-full overflow-hidden bg-black'>
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
            className='h-full w-full rounded-br-none! rounded-bl-none!'
          />
        </div>
      ) : (
        <div className='pt-[56.25%]'>
          <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400'>
            Video cho phim này đang được cập nhật. Vui lòng quay lại sau.
          </p>
        </div>
      )}
      <div className='flex h-16 items-center rounded-br-[12px] rounded-bl-[12px] bg-[#15151a]'>
        <div className='flex w-full items-center gap-4 px-5 select-none'>
          <ButtonLikeWatch targetId={movie.id} className='hover:bg-white/10!' />
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <FaPlus /> Thêm vào
          </Button>
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow group flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
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
            className='hover:text-light-golden-yellow group flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            Rạp phim
            <span className='group-hover:border-light-golden-yellow w-8 cursor-pointer rounded border border-solid border-white p-1 text-center text-[10px] leading-none opacity-50 transition-all duration-200 ease-linear group-hover:opacity-100'>
              OFF
            </span>
          </Button>
          <ButtonShareMovie className='hover:text-light-golden-yellow flex flex-row items-center justify-center gap-2 px-4! py-2.5 text-sm whitespace-nowrap transition-all duration-200 ease-linear' />
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <CiStreamOn className='size-5' />
            Xem chung
          </Button>
          <div className='grow'></div>
          <Button
            variant='ghost'
            className='hover:text-light-golden-yellow flex items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10'
          >
            <FaFlag /> Báo lỗi
          </Button>
        </div>
      </div>
    </div>
  );
}
