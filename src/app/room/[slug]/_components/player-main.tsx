'use client';

import {
  ROOM_STATE_ENDING,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING,
  VIDEO_SOURCE_TYPE_INTERNAL
} from '@/constants';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { RoomResType, VideoLibrarySubtitleResType } from '@/types';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import Link from 'next/link';
import { FaHourglassHalf, FaPlay, FaPodcast } from 'react-icons/fa6';
import { useMovieItemQuery, useVideoLibrarySubtitleListQuery } from '@/queries';
import { VideoPlayer } from '@/components/video-player';
import type { TrackProps } from '@vidstack/react';
import { useAnonymousToken } from '@/hooks';

export function PlayerMain() {
  const room = useRoomStore((state) => state.room);
  const { token, isLoadingToken } = useAnonymousToken();

  const { data: movieItemData } = useMovieItemQuery({
    id: room?.movieItem?.id || '',
    enabled: !!room?.movieItem?.id
  });

  const video = movieItemData?.video;

  const { data: videoLibrarySubtitleListData } =
    useVideoLibrarySubtitleListQuery({
      params: {
        videoLibraryId: video?.id || ''
      },
      enabled: !!video && room?.state === ROOM_STATE_RUNNING
    });

  if (!room) return <PlayerMain.Skeleton />;

  const isPending = room.state === ROOM_STATE_PENDING;
  const isEnded = room.state === ROOM_STATE_ENDING;
  const isRunning = room.state === ROOM_STATE_RUNNING;

  const videoLibrarySubtitles = videoLibrarySubtitleListData?.content || [];

  const textTracks: TrackProps[] = videoLibrarySubtitles.map(
    (subtitle: VideoLibrarySubtitleResType) => ({
      src: renderVttUrl(
        video?.hostname || '',
        subtitle.fileUrl,
        video?.sourceType || 1
      ),
      label: subtitle.label,
      language: subtitle.language,
      kind: 'subtitles',
      type: 'vtt',
      default: subtitle.isDefault
    })
  );

  return (
    <div className='relative aspect-video w-full overflow-hidden bg-transparent'>
      {isPending && <PopupPending room={room} />}
      {isEnded && <PopupEnded room={room} />}
      {isRunning && video ? (
        isLoadingToken ? (
          <div className='flex size-full items-center justify-center bg-black'>
            <div className='size-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent'></div>
          </div>
        ) : (
          <VideoPlayer
            auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL}
            token={token}
            duration={video.duration}
            introEnd={video.introEnd}
            introStart={video.introStart}
            src={renderVideoUrl(
              video.hostname,
              video.content,
              video.sourceType
            )}
            thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
            vttUrl={renderVttUrl(
              video.hostname,
              video.vttUrl,
              video.sourceType
            )}
            outroStart={video.outroStart}
            title={room.movieItem.movie.title}
            className='w-full'
            autoPlay={true}
            textTracks={textTracks}
          />
        )
      ) : (
        <div className='relative size-full grow'>
          <div
            className='absolute inset-0 size-full bg-cover object-contain opacity-50'
            style={{
              backgroundImage: `url(${renderImageUrl(room.movieItem.thumbnailUrl)})`
            }}
          ></div>
        </div>
      )}
    </div>
  );
}

PlayerMain.Skeleton = function PlayerMainSkeleton() {
  return (
    <div className='relative aspect-video w-full overflow-hidden bg-transparent'>
      <div className='relative size-full grow'>
        <Skeleton className='skeleton bg-gunmetal-blue absolute inset-0 size-full opacity-50' />
      </div>
    </div>
  );
};

function PopupPending({ room }: { room: RoomResType }) {
  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Buổi xem chung</div>
      <div className='text-xl'>
        <span className='text-golden-glow font-semibold'>
          {room.movieItem.movie.title}
        </span>
      </div>
      <div className='inline-flex items-center gap-4'>
        <div className='flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black'>
          <FaHourglassHalf className='live-pending' />
          <span>Đang chờ</span>
        </div>
      </div>
    </div>
  );
}

function PopupEnded({ room }: { room: RoomResType }) {
  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Đã kết thúc</div>
      <div className='text-xl'>
        <span className='text-golden-glow font-semibold'>
          {room.movieItem.movie.title}
        </span>
      </div>
      <div className='inline-flex items-center gap-4'>
        <Link
          href={`${route.movie.path}/${room.movieItem.movie.slug}.${room.movieItem.movie.id}`}
          className='flex items-center gap-2 rounded-md bg-white px-4 py-2 text-black'
        >
          <FaPlay />
          <span>Xem riêng</span>
        </Link>
        <Link
          href={route.room.path}
          className='flex items-center gap-2 rounded-md border border-solid border-white bg-transparent px-4 py-2 text-white'
        >
          <FaPodcast />
          <span>Phòng khác</span>
        </Link>
      </div>
    </div>
  );
}
