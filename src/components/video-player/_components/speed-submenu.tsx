'use client';

import { Menu, usePlaybackRateOptions } from '@vidstack/react';
import { OdometerIcon } from '@vidstack/react/icons';
import { submenuClass } from './styles';
import MenuRadio from './menu-radio';
import SubmenuButton from './submenu-button';

export default function SpeedSubmenu() {
  const options = usePlaybackRateOptions();
  const hint = options.selectedValue + 'x';

  return (
    <Menu.Root>
      <SubmenuButton label='Tốc độ' hint={hint} icon={OdometerIcon} />

      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className='flex w-full flex-col'
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <MenuRadio value={value} onSelect={select} key={value}>
              {label}
            </MenuRadio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}
