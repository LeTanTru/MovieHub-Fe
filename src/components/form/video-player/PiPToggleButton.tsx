'use client';

import { useTranslate } from '@/hooks';
import { PIPButton, Tooltip, useMediaState } from '@vidstack/react';
import {
  PictureInPictureExitIcon,
  PictureInPictureIcon
} from '@vidstack/react/icons';

export default function PiPToggleButton() {
  const isPiP = useMediaState('pictureInPicture');
  const isPiPSupported = useMediaState('canPictureInPicture');
  const t = useTranslate();

  if (!isPiPSupported) return null;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className='vds-button'>
          {isPiP ? (
            <PictureInPictureExitIcon className='vds-icon' />
          ) : (
            <PictureInPictureIcon className='vds-icon' />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        {isPiP
          ? t.formatMessage('PiPToggleButton.exit')
          : t.formatMessage('PiPToggleButton.enter')}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
