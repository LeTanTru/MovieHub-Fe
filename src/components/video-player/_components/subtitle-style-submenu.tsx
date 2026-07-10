'use client';

import { Menu } from '@vidstack/react';
import {
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SubtitlesIcon
} from '@vidstack/react/icons';
import { submenuClass } from './styles';
import { MenuRadio } from './menu-radio';
import { SubmenuButton } from './submenu-button';
import {
  subtitleFontSizes,
  subtitleTextColors,
  subtitleBackgroundColors
} from '@/constants';
import { cn } from '@/lib';

type SubtitleStyleSubmenuProps = {
  subtitleEnabled: boolean;
  subtitleFontSize: number;
  subtitleTextColor: number;
  subtitleBackgroundColor: number;
  onSubtitleEnabledToggle: () => void;
  onSubtitleFontSizeChange: (value: number) => void;
  onSubtitleTextColorChange: (value: number) => void;
  onSubtitleBackgroundColorChange: (value: number) => void;
};

export function SubtitleStyleSubmenu({
  subtitleEnabled,
  subtitleFontSize,
  subtitleTextColor,
  subtitleBackgroundColor,
  onSubtitleEnabledToggle,
  onSubtitleFontSizeChange,
  onSubtitleTextColorChange,
  onSubtitleBackgroundColorChange
}: SubtitleStyleSubmenuProps) {
  const currentFontSizeLabel =
    subtitleFontSizes.find((s) => s.value === subtitleFontSize)?.label ?? '';
  const hint = subtitleEnabled ? currentFontSizeLabel : 'Tắt';

  return (
    <Menu.Root>
      <SubmenuButton label='Kiểu phụ đề' hint={hint} icon={SubtitlesIcon} />

      <Menu.Content className={submenuClass}>
        {/* Enable / disable toggle row */}
        <button
          type='button'
          className='ring-media-focus group relative flex w-full cursor-pointer items-center justify-start rounded-sm p-2.5 outline-none select-none hover:bg-white/10 data-[focus]:ring-[3px] data-[hocus]:bg-white/10'
          onClick={onSubtitleEnabledToggle}
        >
          {subtitleEnabled ? (
            <RadioButtonSelectedIcon className='text-media-brand size-4' />
          ) : (
            <RadioButtonIcon className='size-4 text-white' />
          )}
          <span className='ml-2'>Hiển thị phụ đề</span>
        </button>

        {/* Font size section */}
        <div
          className={cn('w-full', {
            'pointer-events-none opacity-40': !subtitleEnabled
          })}
        >
          <p className='px-2.5 pt-2 pb-1 text-xs font-semibold tracking-wide text-white/50 uppercase'>
            Cỡ chữ
          </p>
          <Menu.RadioGroup
            className='flex w-full flex-col'
            value={String(subtitleFontSize)}
          >
            {subtitleFontSizes.map(({ value, label }) => (
              <MenuRadio
                key={value}
                value={String(value)}
                onSelect={() => onSubtitleFontSizeChange(Number(value))}
              >
                {label}
              </MenuRadio>
            ))}
          </Menu.RadioGroup>
        </div>

        {/* Text color section */}
        <div
          className={cn('w-full', {
            'pointer-events-none opacity-40': !subtitleEnabled
          })}
        >
          <p className='px-2.5 pt-2 pb-1 text-xs font-semibold tracking-wide text-white/50 uppercase'>
            Màu chữ
          </p>
          <Menu.RadioGroup
            className='flex w-full flex-col'
            value={String(subtitleTextColor)}
          >
            {subtitleTextColors.map(({ value, label, color }) => (
              <MenuRadio
                key={value}
                value={String(value)}
                onSelect={() => onSubtitleTextColorChange(Number(value))}
              >
                <span
                  className='inline-block size-3 shrink-0 rounded-full border border-white/20'
                  style={{ backgroundColor: String(color) }}
                />
                <span className='ml-2'>{label}</span>
              </MenuRadio>
            ))}
          </Menu.RadioGroup>
        </div>

        {/* Background color section */}
        <div
          className={cn('w-full', {
            'pointer-events-none opacity-40': !subtitleEnabled
          })}
        >
          <p className='px-2.5 pt-2 pb-1 text-xs font-semibold tracking-wide text-white/50 uppercase'>
            Màu nền
          </p>
          <Menu.RadioGroup
            className='flex w-full flex-col'
            value={String(subtitleBackgroundColor)}
          >
            {subtitleBackgroundColors.map(({ value, label, color }) => (
              <MenuRadio
                key={value}
                value={String(value)}
                onSelect={() => onSubtitleBackgroundColorChange(Number(value))}
              >
                {color ? (
                  <span
                    className='inline-block size-3 shrink-0 rounded-full border border-white/20'
                    style={{ backgroundColor: String(color) }}
                  />
                ) : (
                  <span className='inline-block size-3 shrink-0 rounded-full border border-white/40 bg-transparent' />
                )}
                <span className='ml-2'>{label}</span>
              </MenuRadio>
            ))}
          </Menu.RadioGroup>
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}
