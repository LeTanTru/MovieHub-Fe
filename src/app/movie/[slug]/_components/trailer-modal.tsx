'use client';

import { Modal } from '@/components/modal';
import { VideoPlayer } from '@/components/video-player';
import { VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import { VideoResType } from '@/types';
import { renderImageUrl, renderVideoUrl, renderVttUrl } from '@/utils';
import { useEffect, useRef, useState } from 'react';

export default function VideoPlayModal({
  opened,
  video,
  onClose
}: {
  video: VideoResType;
  opened: boolean;
  onClose: () => void;
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

    const timeoutId = setTimeout(updateHeight, 100);

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(bodyRef.current);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [opened]);

  return (
    <Modal
      title={video.name}
      open={opened}
      onClose={onClose}
      className='[&_.body-wrapper]:dark:bg-review-modal [&_.body-wrapper]:-top-5 [&_.body-wrapper]:aspect-video [&_.body-wrapper]:min-h-[90vh] [&_.body-wrapper]:w-350 [&_.body-wrapper]:max-[1537px]:h-[92.5vh] [&_.body-wrapper]:max-[1537px]:min-h-[92.5vh] [&_.body-wrapper]:max-[1537px]:w-280'
      aria-labelledby='video-modal-title'
      aria-label={`Phát video ${video.name}`}
      bodyRef={bodyRef}
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
          auth={video.sourceType === VIDEO_SOURCE_TYPE_INTERNAL ? true : false}
          duration={video.duration}
          introEnd={video.introEnd}
          introStart={video.introStart}
          source={renderVideoUrl(video.content)}
          thumbnailUrl={renderImageUrl(video.thumbnailUrl)}
          vttUrl={renderVttUrl(video.vttUrl)}
          outroStart={video.outroStart}
        />
      </div>
    </Modal>
  );
}
