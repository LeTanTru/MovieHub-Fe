'use client';

import { useTranslate } from '@/hooks';
import {
  CaptionButton as OriginCaptionButton,
  isTrackCaptionKind,
  Tooltip,
  useMediaState
} from '@vidstack/react';
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon
} from '@vidstack/react/icons';

export default function CaptionButton() {
  const t = useTranslate();
  const track = useMediaState('textTrack'),
    isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <OriginCaptionButton className='vds-button'>
          {isOn ? (
            <ClosedCaptionsOnIcon className='vds-icon' />
          ) : (
            <ClosedCaptionsIcon className='vds-icon' />
          )}
        </OriginCaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        {isOn
          ? t.formatMessage('CaptionButton.off')
          : t.formatMessage('CaptionButton.on')}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
