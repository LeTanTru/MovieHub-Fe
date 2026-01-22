'use client';

import { Tooltip } from '@vidstack/react';
import { PreviousIcon } from '@vidstack/react/icons';

export default function PreviousButton() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className='vds-button' aria-label='Next video'>
          <PreviousIcon size={32} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top'>
        Tập trước
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
