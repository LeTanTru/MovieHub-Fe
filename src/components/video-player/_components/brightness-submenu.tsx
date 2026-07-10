'use client';

import { Menu } from '@vidstack/react';
import { SunIcon } from '@vidstack/react/icons';
import { submenuClass } from './styles';
import { SubmenuButton } from './submenu-button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { BRIGHTNESS_MAX, BRIGHTNESS_MIN } from '@/constants';

type BrightnessSubmenuProps = {
  brightness: number;
  onBrightnessChange: (value: number) => void;
};

export function BrightnessSubmenu({
  brightness,
  onBrightnessChange
}: BrightnessSubmenuProps) {
  const hint = `${brightness}%`;

  return (
    <Menu.Root>
      <SubmenuButton label='Độ sáng' hint={hint} icon={SunIcon} />

      <Menu.Content className={submenuClass}>
        <div className='p-2'>
          <div className='flex items-center justify-between gap-2 rounded-sm bg-white/10 px-3 py-2'>
            <SunIcon className='size-4 shrink-0 text-white/70' />
            <Slider
              min={BRIGHTNESS_MIN}
              max={BRIGHTNESS_MAX}
              step={5}
              value={[brightness]}
              onValueChange={([v]) => onBrightnessChange(v)}
              className='w-full'
              rangeClassName='bg-white cursor-pointer'
              thumbClassName='border-white bg-white cursor-pointer'
              trackClassName='bg-white/20'
            />
            <Badge className='w-10 bg-transparent p-0 text-right text-sm text-white/70 hover:bg-transparent'>
              {hint}
            </Badge>
          </div>
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}
