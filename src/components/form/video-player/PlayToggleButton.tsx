'use client';

import { useTranslate } from '@/hooks';
import { PlayButton, Tooltip, useMediaState } from '@vidstack/react';
import { PauseIcon, PlayIcon } from '@vidstack/react/icons';

export default function PlayToggleButton() {
  const isPaused = useMediaState('paused');
  const t = useTranslate();
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className='vds-button'>
          {isPaused ? (
            <PlayIcon className='vds-icon' />
          ) : (
            <PauseIcon className='vds-icon' />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        {isPaused
          ? t.formatMessage('PlayToggleButton.play')
          : t.formatMessage('PlayToggleButton.pause')}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
