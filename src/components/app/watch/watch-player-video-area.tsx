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
import { useState } from 'react';
import { envConfig } from '@/config';
import { useDisclosure } from '@/hooks';
import { Activity } from '@/components/activity';
import { usePlayerSettings } from '@/app/watch/[slug]/_hooks';
import { useWatchPlayer } from '@/app/watch/[slug]/_context';
import { useVideoLibrarySubtitleListQuery } from '@/queries';
import { VideoLibrarySubtitleResType } from '@/types';
import { TrackProps } from '@vidstack/react';

export function WatchPlayerVideoArea() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerSettings = usePlayerSettings();

  const {
    opened: isEpisodeListOpen,
    open: openEpisodeList,
    close: closeEpisodeList
  } = useDisclosure();

  const {
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
    handlePlayerCanPlay
  } = useWatchPlayer();

  const { data: videoLibrarySubtitleListData } =
    useVideoLibrarySubtitleListQuery({
      params: {
        videoLibraryId: video?.id || ''
      },
      enabled: !!video
    });

  const videoLibrarySubtitles = videoLibrarySubtitleListData?.content || [];

  if (!video) {
    return (
      <div className='aspect-video rounded-tl rounded-tr bg-black'>
        <p className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-base text-gray-300'>
          Video cho phim này đang được cập nhật. Vui lòng quay lại sau.
        </p>
      </div>
    );
  }

  const textTracks: TrackProps[] = videoLibrarySubtitles.map(
    (subtitle: VideoLibrarySubtitleResType) => ({
      src: renderVttUrl(video.hostname, subtitle.fileUrl, video.sourceType),
      label: subtitle.label,
      language: subtitle.language,
      kind: 'subtitles',
      type: 'vtt',
      default: subtitle.isDefault
    })
  );

  return (
    <div className='max-800:rounded-none relative aspect-video w-full overflow-hidden rounded-tl-[6px] rounded-tr-[6px]'>
      {isLoadingToken ? (
        <div className='flex h-full w-full items-center justify-center bg-black'>
          <div className='size-12 animate-spin rounded-full border-4 border-solid border-gray-200 border-t-transparent'></div>
        </div>
      ) : (
        <>
          <VideoPlayer
            ref={playerRef}
            auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL}
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
                      `hover:text-golden-glow max-800:hidden font-medium hover:bg-transparent`,
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
              envConfig.NEXT_PUBLIC_NODE_ENV === 'development'
                ? 0
                : isMobileDevice() || isTabletDevice()
                  ? playerSettings.audio / 100 || 1
                  : playerSettings.audio / 100 || 0.5
            }
            playbackRate={playerSettings.playbackSpeed || 1}
            defaultQuality={playerSettings.resolution}
            prev={isSeries && !isFirstEpisode}
            next={isSeries && !isLastEpisode}
            skipOutro={isSeries && !isLastEpisode}
            onPrevClick={handlePrevEpisode}
            onNextClick={handleNextEpisode}
            onTimeUpdate={handleWatchHistoryTimeUpdate}
            onSeeked={handleSeeked}
            onEnded={handleVideoEnded}
            onLoadedMetadata={handlePlayerCanPlay}
            onFullscreenChange={setIsFullscreen}
            textTracks={textTracks}
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
          seasons={movie?.seasons || []}
          isOpen={isEpisodeListOpen}
          onToggle={closeEpisodeList}
        />
      </Activity>
    </div>
  );
}
