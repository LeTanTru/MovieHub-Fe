'use client';

import './trailer-modal.css';
import { Modal } from '@/components/modal';
import { VideoPlayer } from '@/components/video-player';
import { VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import { useBodyHeight } from '@/hooks';
import { VideoResType } from '@/types';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import { useEffect, useRef } from 'react';

export default function TrailerModal({
  opened,
  video,
  onClose,
  token
}: {
  video: VideoResType;
  opened: boolean;
  onClose: () => void;
  token: string;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyHeight = useBodyHeight<HTMLDivElement>(bodyRef, [opened]);

  useEffect(() => {
    if (opened && bodyRef.current) {
      const timer = setTimeout(() => {
        const videoPlayer = bodyRef.current?.querySelector('.video-player');
        if (videoPlayer instanceof HTMLElement) {
          videoPlayer.focus();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [opened]);

  return (
    <Modal
      title={video.name}
      open={opened}
      onClose={onClose}
      className='trailer-modal overflow-hidden'
      aria-labelledby='video-modal-title'
      aria-label={`Phát video ${video.name}`}
      bodyRef={bodyRef}
      confirmOnClose
      confirmOnCloseMessage='Bạn có chắc chắn muốn đóng không?'
      confirmClassName='dark:bg-charade'
    >
      <div
        style={
          {
            height: bodyHeight,
            '--player-height': `${bodyHeight}px`,
            '--media-height': `${bodyHeight}px`
          } as React.CSSProperties
        }
      >
        <VideoPlayer
          auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL}
          duration={video.duration}
          introEnd={video.introEnd}
          introStart={video.introStart}
          src={renderVideoUrl(video.content)}
          thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
          vttUrl={renderVttUrl(video.vttUrl)}
          outroStart={video.outroStart}
          className='rounded-md!'
          token={token}
        />
      </div>
    </Modal>
  );
}
