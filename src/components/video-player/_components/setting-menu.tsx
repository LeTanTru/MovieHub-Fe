'use client';

import {
  Menu,
  Tooltip,
  type MenuPlacement,
  type TooltipPlacement
} from '@vidstack/react';
import { SettingsIcon } from '@vidstack/react/icons';
import {
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  SUBTITLE_FONT_SIZE_SMALL,
  SUBTITLE_TEXT_COLOR_YELLOW
} from '@/constants';
import { buttonClass, menuClass, tooltipClass } from './styles';
import { BrightnessSubmenu } from './brightness-submenu';
import { CaptionSubmenu } from './caption-submenu';
import { QualitySubmenu } from './quality-submenu';
import { SpeedSubmenu } from './speed-submenu';
import { SubtitleStyleSubmenu } from './subtitle-style-submenu';
import { VolumeSubmenu } from './volume-submenu';

type SettingsProps = {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
  disableSpeed?: boolean;
  brightness?: number;
  subtitleEnabled?: boolean;
  subtitleFontSize?: number;
  subtitleTextColor?: number;
  subtitleBackgroundColor?: number;
  onBrightnessChange?: (value: number) => void;
  onSubtitleEnabledToggle?: () => void;
  onSubtitleFontSizeChange?: (value: number) => void;
  onSubtitleTextColorChange?: (value: number) => void;
  onSubtitleBackgroundColorChange?: (value: number) => void;
};

export function SettingMenu({
  placement,
  tooltipPlacement,
  disableSpeed,
  brightness,
  subtitleEnabled,
  subtitleFontSize,
  subtitleTextColor,
  subtitleBackgroundColor,
  onBrightnessChange,
  onSubtitleEnabledToggle,
  onSubtitleFontSizeChange,
  onSubtitleTextColorChange,
  onSubtitleBackgroundColorChange
}: SettingsProps) {
  return (
    <Menu.Root className='parent'>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <SettingsIcon className='size-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90' />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          Cài đặt
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <VolumeSubmenu />
        <QualitySubmenu />
        {brightness !== undefined && onBrightnessChange && (
          <BrightnessSubmenu
            brightness={brightness}
            onBrightnessChange={onBrightnessChange}
          />
        )}
        {subtitleEnabled !== undefined &&
          onSubtitleEnabledToggle &&
          onSubtitleFontSizeChange &&
          onSubtitleTextColorChange &&
          onSubtitleBackgroundColorChange && (
            <SubtitleStyleSubmenu
              subtitleEnabled={subtitleEnabled}
              subtitleFontSize={subtitleFontSize ?? SUBTITLE_FONT_SIZE_SMALL}
              subtitleTextColor={
                subtitleTextColor ?? SUBTITLE_TEXT_COLOR_YELLOW
              }
              subtitleBackgroundColor={
                subtitleBackgroundColor ?? SUBTITLE_BACKGROUND_COLOR_TRANSPARENT
              }
              onSubtitleEnabledToggle={onSubtitleEnabledToggle}
              onSubtitleFontSizeChange={onSubtitleFontSizeChange}
              onSubtitleTextColorChange={onSubtitleTextColorChange}
              onSubtitleBackgroundColorChange={onSubtitleBackgroundColorChange}
            />
          )}
        <CaptionSubmenu />
        <SpeedSubmenu disabled={disableSpeed} />
      </Menu.Content>
    </Menu.Root>
  );
}
