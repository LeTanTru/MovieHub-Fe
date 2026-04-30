'use client';

import './trailer-modal.css';
import { Modal } from '@/components/modal';
import { VideoPlayer } from '@/components/video-player';
import envConfig from '@/config';
import { VIDEO_SOURCE_TYPE_INTERNAL } from '@/constants';
import { VideoResType } from '@/types';
import {
  isMobileDevice,
  isTabletDevice,
  renderImageUrl,
  renderVideoUrl,
  renderVttUrl
} from '@/utils';

type TrailerModalProps = {
  video: VideoResType;
  opened: boolean;
  onClose: () => void;
  token: string;
};

export default function TrailerModal({
  opened,
  video,
  onClose,
  token
}: TrailerModalProps) {
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
          volume={
            envConfig.NEXT_PUBLIC_NODE_ENV === 'development'
              ? 0
              : isMobileDevice() || isTabletDevice()
                ? 1
                : 0.5
          }
        />
      </Modal.Body>
      <Modal.Confirm message='Bạn có chắc chắn muốn đóng không?' />
    </Modal>
  );
}
