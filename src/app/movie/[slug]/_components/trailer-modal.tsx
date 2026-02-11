'use client';

import './trailer-modal.css';
import { Modal } from '@/components/modal';
import { VideoPlayer } from '@/components/video-player';
import { trailerMotionVariant, VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import { VideoResType } from '@/types';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import { useEffect, useRef, useState } from 'react';

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
  const [bodyHeight, setBodyHeight] = useState<number>(0);

  useEffect(() => {
    if (!opened || !bodyRef.current) return;

    const updateHeight = () => {
      if (bodyRef.current) {
        const height = bodyRef.current.clientHeight;
        setBodyHeight(height);
      }
    };

    const timeoutId = setTimeout(updateHeight, 200);

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(bodyRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [opened]);

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

  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [opened]);

  return (
    <Modal
      title={video.name}
      open={opened}
      onClose={onClose}
      className='trailer-modal overflow-hidden'
      headerClassName='pt-10'
      aria-labelledby='video-modal-title'
      aria-label={`Phát video ${video.name}`}
      bodyRef={bodyRef}
      variants={{
        initial: trailerMotionVariant.initial,
        animate: trailerMotionVariant.animate,
        exit: trailerMotionVariant.exit
      }}
      closeOnBackdropClick
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
          source={renderVideoUrl(video.content)}
          thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
          vttUrl={renderVttUrl(video.vttUrl)}
          outroStart={video.outroStart}
          className='rounded-br-lg! rounded-bl-lg!'
          token={token}
        />
      </div>
    </Modal>
  );
}
