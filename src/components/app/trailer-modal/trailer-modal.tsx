'use client';

import './trailer-modal.css';
import { Modal } from '@/components/modal';
import { VideoPlayer } from '@/components/video-player';
import { languages, VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import { usePlayerSettings } from '@/hooks';
import { useVideoLibrarySubtitleListQuery } from '@/queries';
import type { VideoLibrarySubtitleResType, VideoResType } from '@/types';
import {
  isMobileDevice,
  isTabletDevice,
  renderImageUrl,
  renderVideoUrl,
  renderVttUrl
} from '@/utils';
import type { TrackProps } from '@vidstack/react';

type TrailerModalProps = {
  video: VideoResType;
  opened: boolean;
  onClose: () => void;
  token: string;
};

export function TrailerModal({
  opened,
  video,
  onClose,
  token
}: TrailerModalProps) {
  const {
    brightness,
    subtitleEnabled,
    subtitleFontSize,
    subtitleTextColor,
    subtitleBackgroundColor,
    handleChangeBrightness,
    handleToggleSubtitleEnabled,
    handleChangeSubtitleFontSize,
    handleChangeSubtitleTextColor,
    handleChangeSubtitleBackgroundColor
  } = usePlayerSettings();

  const { data: videoLibrarySubtitleListData } =
    useVideoLibrarySubtitleListQuery({
      params: { videoLibraryId: video?.id || '' },
      enabled: opened && !!video?.id
    });

  const videoLibrarySubtitles = videoLibrarySubtitleListData?.content || [];

  const textTracks: TrackProps[] = videoLibrarySubtitles.map(
    (subtitle: VideoLibrarySubtitleResType) => ({
      src: renderVttUrl(video.hostname, subtitle.fileUrl, video.sourceType),
      label:
        languages.find((lang) => lang.value === subtitle.language)?.label ||
        subtitle.label,
      language: subtitle.language,
      kind: 'subtitles',
      type: 'vtt',
      default: subtitleEnabled && subtitle.isDefault
    })
  );

  return (
    <Modal
      open={opened}
      onClose={onClose}
      className='trailer-modal top-1/2 left-1/2 z-999 mx-0 -translate-x-1/2 -translate-y-1/2'
      aria-labelledby='video-modal-title'
      aria-label={`Phát video ${video.name}`}
      confirmOnClose
    >
      <Modal.Body className='z-999'>
        <VideoPlayer
          auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL}
          duration={video.duration}
          introEnd={video.introEnd}
          introStart={video.introStart}
          src={renderVideoUrl(video.hostname, video.content, video.sourceType)}
          thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
          vttUrl={renderVttUrl(video.hostname, video.vttUrl, video.sourceType)}
          outroStart={video.outroStart}
          className='rounded-md!'
          token={token}
          volume={isMobileDevice() || isTabletDevice() ? 1 : 0.5}
          textTracks={textTracks}
          brightness={brightness}
          subtitleEnabled={subtitleEnabled}
          subtitleFontSize={subtitleFontSize}
          subtitleTextColor={subtitleTextColor}
          subtitleBackgroundColor={subtitleBackgroundColor}
          onBrightnessChange={handleChangeBrightness}
          onSubtitleEnabledToggle={handleToggleSubtitleEnabled}
          onSubtitleFontSizeChange={handleChangeSubtitleFontSize}
          onSubtitleTextColorChange={handleChangeSubtitleTextColor}
          onSubtitleBackgroundColorChange={handleChangeSubtitleBackgroundColor}
        />
      </Modal.Body>
      <Modal.Confirm message='Bạn có chắc chắn muốn đóng không ?' />
    </Modal>
  );
}
