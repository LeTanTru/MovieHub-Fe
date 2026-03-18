'use client';

import { VideoPlayer } from '@/components/video-player';
import { VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import {
  renderImageUrl,
  renderVideoUrl,
  renderVttUrl,
  isMobileDevice,
  isTabletDevice
} from '@/utils';
import { Button } from '@/components/form';
import { PlaylistIcon } from '@/assets';
import { cn } from '@/lib';
import { EpisodeList, WatchAskContinueModal } from '@/components/app/watch';
import { MovieResType, VideoResType } from '@/types';
import type {
  MediaPlayerInstance,
  MediaTimeUpdateEventDetail
} from '@vidstack/react';
import { RefObject, useState } from 'react';
import envConfig from '@/config';
import { useDisclosure } from '@/hooks';
import { Activity } from '@/components/activity';

type EpisodeProps = {
  isSeries: boolean;
  isFirstEpisode: boolean;
  isLastEpisode: boolean;
  onPrev: () => void;
  onNext: () => void;
};

type ContinueModalProps = {
  isOpen: boolean;
  lastWatchedSeconds: number;
  onContinue: () => void;
  onStartOver: () => void;
};

type CallbackProps = {
  onTimeUpdate: (detail: MediaTimeUpdateEventDetail) => void;
  onSeeked: (currentTime: number) => void;
  onEnded: () => void;
  onCanPlay: () => void;
};

type Props = {
  video: VideoResType | null | undefined;
  isLoadingToken: boolean;
  autoPlay: boolean;
  token: string;
  videoTitle: string;
  movie: MovieResType;
  playerRef: RefObject<MediaPlayerInstance | null>;
  episode: EpisodeProps;
  continueModal: ContinueModalProps;
  callbacks: CallbackProps;
};

export default function WatchPlayerVideoArea({
  video,
  isLoadingToken,
  autoPlay,
  token,
  videoTitle,
  movie,
  playerRef,
  episode,
  continueModal,
  callbacks
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {
    opened: isEpisodeListOpen,
    open: openEpisodeList,
    close: closeEpisodeList
  } = useDisclosure();

  const { isSeries, isFirstEpisode, isLastEpisode, onPrev, onNext } = episode;
  const {
    isOpen: isShowContinueModal,
    lastWatchedSeconds,
    onContinue: handleContinueWatching,
    onStartOver: handleStartOver
  } = continueModal;
  const {
    onTimeUpdate: handleWatchHistoryTimeUpdate,
    onSeeked: handleSeeked,
    onEnded: handleVideoEnded,
    onCanPlay: handlePlayerCanPlay
  } = callbacks;

  if (!video) {
    return (
      <div className='aspect-video rounded-tl rounded-tr bg-black'>
        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400'>
          Video cho phim này đang được cập nhật. Vui lòng quay lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className='max-800:rounded-none relative aspect-video w-full overflow-hidden rounded-tl-[6px] rounded-tr-[6px]'>
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
            src={renderVideoUrl(video.content)}
            thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
            vttUrl={renderVttUrl(video.vttUrl)}
            outroStart={video.outroStart}
            token={token}
            title={videoTitle}
            className='w-full'
            autoPlay={autoPlay}
            hideVolumeIndicator={isShowContinueModal}
            slots={{
              topControlsGroupStart: !isFullscreen ? (
                <span className='max-800:hidden text-base font-medium'>
                  {videoTitle}
                </span>
              ) : null,
              topControlsGroupEnd:
                !isFullscreen && isSeries ? (
                  <Button
                    variant='ghost'
                    className={cn(
                      `dark:hover:text-golden-glow max-800:hidden font-medium dark:hover:bg-transparent`,
                      {
                        'dark:text-golden-glow': isEpisodeListOpen
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
              envConfig.NEXT_PUBLIC_NODE_ENV === 'development'
                ? 0
                : isMobileDevice() || isTabletDevice()
                  ? 1
                  : 0.5
            }
            prev={isSeries && !isFirstEpisode}
            next={isSeries && !isLastEpisode}
            skipOutro={isSeries && !isLastEpisode}
            onPrevClick={onPrev}
            onNextClick={onNext}
            onTimeUpdate={handleWatchHistoryTimeUpdate}
            onSeeked={handleSeeked}
            onEnded={handleVideoEnded}
            onLoadedMetadata={handlePlayerCanPlay}
            onFullscreenChange={setIsFullscreen}
          />
          <WatchAskContinueModal
            opened={isShowContinueModal}
            lastWatchedSeconds={lastWatchedSeconds}
            onContinueWatching={handleContinueWatching}
            onStartOver={handleStartOver}
          />
        </>
      )}
      <Activity visible={isSeries}>
        <EpisodeList
          seasons={movie.seasons}
          isOpen={isEpisodeListOpen}
          onToggle={closeEpisodeList}
        />
      </Activity>
    </div>
  );
}
