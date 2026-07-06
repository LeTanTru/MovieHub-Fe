'use client';

import { PlayButton, Tooltip, useMediaState } from '@vidstack/react';
import { PauseIcon, PlayIcon } from '@vidstack/react/icons';

export function PlayToggleButton({ disabled }: { disabled?: boolean }) {
  const isPaused = useMediaState('paused');
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className='vds-button' disabled={disabled}>
          {isPaused ? (
            <PlayIcon className='vds-icon' />
          ) : (
            <PauseIcon className='vds-icon' />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        {isPaused ? 'Phát' : 'Tạm dừng'}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
