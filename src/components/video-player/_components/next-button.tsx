'use client';

import { Tooltip } from '@vidstack/react';
import { NextIcon } from '@vidstack/react/icons';

export default function NextButton() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button className='vds-button' aria-label='Next video'>
          <NextIcon size={32} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top'>
        Tập tiếp theo
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
