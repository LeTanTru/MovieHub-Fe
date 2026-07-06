'use client';

import { SeekButton, Tooltip } from '@vidstack/react';
import { SeekBackward10Icon } from '@vidstack/react/icons';

export function SeekBackwardButton({ disabled }: { disabled?: boolean }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className='vds-button' seconds={-10} disabled={disabled}>
          <SeekBackward10Icon className='vds-icon' />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        Quay lại 10 giây
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
