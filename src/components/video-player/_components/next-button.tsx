'use client';

import { Tooltip } from '@vidstack/react';
import { NextIcon } from '@vidstack/react/icons';

type NextButtonProps = {
  onClickAction: () => void;
};

export default function NextButton({ onClickAction }: NextButtonProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClickAction();
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          className='vds-button'
          aria-label='Next video'
          onClick={handleClick}
          onTouchEnd={handleClick}
          style={{ touchAction: 'manipulation' }}
        >
          <NextIcon size={32} />
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content className='vds-tooltip-content' placement='top'>
        Tập tiếp theo
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
