'use client';

import {
  ErrorCode,
  MILLISECOND,
  mqttCMDs,
  mqttTopics,
  queryKeys,
  ROOM_STATE_ENDED,
  ROOM_STATE_PENDING,
  ROOM_STATE_RUNNING,
  VIDEO_SOURCE_TYPE_INTERNAL
} from '@/constants';
import { route } from '@/routes';
import { useRoomStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RoomPlayerStateType,
  RoomResType,
  VideoLibrarySubtitleResType
} from '@/types';
import {
  generateMqttTopic,
  invalidateQueries,
  notify,
  publishMqttMessage,
  renderImageUrl,
  renderVideoUrl,
  renderVttUrl
} from '@/utils';
import Link from 'next/link';
import { FaHourglassHalf, FaPlay, FaPodcast } from 'react-icons/fa6';
import {
  useJoinRoomMutation,
  useMovieItemQuery,
  useVideoLibrarySubtitleListQuery
} from '@/queries';
import { VideoPlayer } from '@/components/video-player';
import type { MediaPlayerInstance, TrackProps } from '@vidstack/react';
import { useAnonymousToken, useAuth } from '@/hooks';
import { logger } from '@/logger';
import { useShallow } from 'zustand/shallow';
import { useEffect, useRef } from 'react';

export function PlayerMain() {
  const { token, isLoadingToken } = useAnonymousToken();
  const { profile } = useAuth();
  const playerRef = useRef<MediaPlayerInstance>(null);

  const { room, isJoined, playerState } = useRoomStore(
    useShallow((state) => ({
      room: state.room,
      isJoined: state.isJoined,
      playerState: state.playerState
    }))
  );

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

  const isHost = !!room && profile?.id === room.host.id;

  useEffect(() => {
    useRoomStore
      .getState()
      .setGetPlayerCurrentTime(
        () => (playerRef.current?.currentTime ?? 0) * MILLISECOND
      );
  }, []);

  // Handle seek
  useEffect(() => {
    if (!playerRef.current || isHost) return;
    playerRef.current.currentTime =
      playerState.currentPositionMovie / MILLISECOND;
  }, [playerState.currentPositionMovie, isHost]);

  // Handle change play speed
  useEffect(() => {
    if (!playerRef.current || isHost) return;

    if (playerRef.current.playbackRate !== playerState.playSpeed) {
      playerRef.current.playbackRate = playerState.playSpeed;
    }
  }, [playerState.playSpeed, isHost]);

  useEffect(() => {
    if (!playerRef.current || isHost) return;

    if (playerState.isPlay) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  }, [playerState.isPlay, isHost]);

  if (!room) return <PlayerMain.Skeleton />;

  const isPending = room.state === ROOM_STATE_PENDING;
  const isEnded = room.state === ROOM_STATE_ENDED;
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

  const handleCanPlay = () => {
    if (!playerRef.current) return;

    if (!isHost) {
      playerRef.current.currentTime =
        playerState.currentPositionMovie / MILLISECOND;
      playerRef.current.playbackRate = playerState.playSpeed;
      if (playerState.isPlay) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
      return;
    }

    const newState = {
      ...playerState,
      currentPositionMovie: playerRef.current.currentTime * MILLISECOND,
      playSpeed: playerRef.current.playbackRate
    };
    useRoomStore.getState().setPlayerState(newState);
  };

  const publishRoomState = async (
    newState: RoomPlayerStateType,
    subCmd: string
  ) => {
    if (!isHost) return;

    await publishMqttMessage(
      generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
      {
        cmd: mqttCMDs.ROOM_STATE,
        data: {
          ...newState,
          subCmd
        }
      }
    );
  };

  const handleRateChange = async (rate: number) => {
    const newState = { ...playerState, playSpeed: rate };
    useRoomStore.getState().setPlayerState(newState);
    await publishRoomState(newState, mqttCMDs.ROOM_PLAY_SPEED);
  };

  const handleSeek = async (currentTime: number) => {
    const newState = {
      ...playerState,
      currentPositionMovie: currentTime * MILLISECOND
    };
    useRoomStore.getState().setPlayerState(newState);
    await publishRoomState(newState, mqttCMDs.ROOM_SEEK);
  };

  const handlePause = async () => {
    if (!isHost) return;

    const newState = {
      ...playerState,
      isPlay: false,
      currentPositionMovie: (playerRef.current?.currentTime ?? 0) * MILLISECOND
    };
    useRoomStore.getState().setPlayerState(newState);
    await publishRoomState(newState, mqttCMDs.ROOM_PAUSE);
  };

  const handlePlay = async () => {
    if (!isHost) return;

    const newState = {
      ...playerState,
      isPlay: true,
      currentPositionMovie: (playerRef.current?.currentTime ?? 0) * MILLISECOND
    };
    useRoomStore.getState().setPlayerState(newState);
    await publishRoomState(newState, mqttCMDs.ROOM_PLAY);
  };

  return (
    <div className='relative aspect-video w-full overflow-hidden bg-transparent'>
      {isPending && <PopupPending room={room} />}
      {isEnded && <PopupEnded room={room} />}
      {isRunning && !isJoined && <PopupRunning room={room} />}
      {isRunning && isJoined && video ? (
        isLoadingToken ? (
          <div className='flex size-full items-center justify-center bg-black'>
            <div className='size-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent'></div>
          </div>
        ) : (
          <VideoPlayer
            ref={playerRef}
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
            autoPlay={isHost ? true : playerState.isPlay}
            hideControls={!isHost}
            hidePoster={playerState.currentPositionMovie > 0}
            textTracks={textTracks}
            onCanPlay={handleCanPlay}
            onRateChange={handleRateChange}
            onSeeked={handleSeek}
            onPause={handlePause}
            onPlay={handlePlay}
          />
        )
      ) : (
        <div className='relative size-full grow'>
          <div
            className='absolute inset-0 size-full bg-cover object-contain opacity-50'
            style={{
              backgroundImage: `url(${renderImageUrl(room?.movieItem?.thumbnailUrl || '')})`
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

function PopupRunning({ room }: { room: RoomResType }) {
  const { profile } = useAuth();
  const { mutate: joinRoom } = useJoinRoomMutation();
  const setIsJoined = useRoomStore((state) => state.setIsJoined);

  const isHost = profile?.id === room.host.id;

  const handleJoinRoom = () => {
    if (isHost) {
      setIsJoined(true);
      return;
    }

    joinRoom(room.id, {
      onSuccess: async (res) => {
        if (res.result) {
          notify.success('Tham gia phòng thành công');
          await publishMqttMessage(
            generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
            {
              cmd: mqttCMDs.PARTICIPANT_JOIN,
              data: { id: profile?.id || '' }
            }
          );
          setIsJoined(true);
        } else {
          const errorCode = res.code;
          if (errorCode === ErrorCode.ROOM_ERROR_INVALID_STATE) {
            invalidateQueries([queryKeys.ROOM, room.id]);
          } else {
            notify.error('Tham gia phòng thất bại');
          }
        }
      },
      onError: (error) => {
        logger.error('[JOIN_ROOM_ERROR]', error);
        notify.error('Tham gia phòng thất bại');
      }
    });
  };

  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Buổi xem chung</div>
      <div className='text-xl'>
        <span className='text-golden-glow font-semibold'>
          {room.movieItem.movie.title}
        </span>
      </div>
      <button
        onClick={handleJoinRoom}
        className='mx-auto flex cursor-pointer items-center gap-2 rounded-md bg-white px-4 py-2 text-black transition-all duration-200 ease-linear hover:bg-white/80'
      >
        <FaPlay />
        <span>{isHost ? 'Tiếp tục' : 'Tham gia'}</span>
      </button>
    </div>
  );
}

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
  const endReason = useRoomStore((state) => state.endReason);

  return (
    <div className='bg-transparent-black-2 border-black-alpha-8 absolute top-1/2 left-1/2 z-3 flex w-full max-w-110 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 rounded-2xl border border-solid p-8 text-center shadow-[0_20px_20px_10px_var(--color-transparent-black-3)] backdrop-blur-[20px]'>
      <div className='text-base'>Đã kết thúc</div>
      <div className='flex flex-col gap-2'>
        <span className='text-golden-glow text-xl font-semibold'>
          {room.movieItem.movie.title}
        </span>
        {endReason && <span className='text-dark-gray'>{endReason}</span>}
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
