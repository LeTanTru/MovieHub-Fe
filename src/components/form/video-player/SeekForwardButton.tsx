'use client';

import { useTranslate } from '@/hooks';
import { SeekButton, Tooltip } from '@vidstack/react';
import { SeekForward10Icon } from '@vidstack/react/icons';

export default function SeekForwardButton() {
  const t = useTranslate();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className='vds-button' seconds={10}>
          <SeekForward10Icon className='vds-icon' />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top center'>
        {t.formatMessage('SeekForwardButton.forward10Seconds')}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
