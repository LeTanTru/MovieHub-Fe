'use client';

import { Tooltip } from '@vidstack/react';
import { PreviousIcon } from '@vidstack/react/icons';

export default function PreviousButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          className='vds-button'
          aria-label='Previous video'
          onClick={onClick}
        >
          <PreviousIcon size={32} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top'>
        Tập trước
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
