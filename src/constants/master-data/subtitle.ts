import {
  SUBTITLE_BACKGROUND_COLOR_BLACK,
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  SUBTITLE_BACKGROUND_COLOR_WHITE,
  SUBTITLE_BACKGROUND_COLOR_YELLOW,
  SUBTITLE_FONT_SIZE_LARGE,
  SUBTITLE_FONT_SIZE_MEDIUM,
  SUBTITLE_FONT_SIZE_SMALL,
  SUBTITLE_TEXT_COLOR_BLACK,
  SUBTITLE_TEXT_COLOR_WHITE,
  SUBTITLE_TEXT_COLOR_YELLOW
} from '@/constants/constant';
import type { OptionType } from '@/types';

export const subtitleFontSizes: OptionType[] = [
  { value: SUBTITLE_FONT_SIZE_SMALL, label: 'Nhỏ', pixels: 20 },
  { value: SUBTITLE_FONT_SIZE_MEDIUM, label: 'Vừa', pixels: 24 },
  { value: SUBTITLE_FONT_SIZE_LARGE, label: 'Lớn', pixels: 28 }
];

export const subtitleTextColors: OptionType[] = [
  {
    value: SUBTITLE_TEXT_COLOR_YELLOW,
    label: 'Vàng',
    color: '#FFF09B'
  },
  {
    value: SUBTITLE_TEXT_COLOR_WHITE,
    label: 'Trắng',
    color: '#FFFFFF'
  },
  {
    value: SUBTITLE_TEXT_COLOR_BLACK,
    label: 'Đen',
    color: '#000000'
  }
];

export const subtitleBackgroundColors: OptionType[] = [
  {
    value: SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
    label: 'Trong suốt',
    color: 'transparent'
  },
  {
    value: SUBTITLE_BACKGROUND_COLOR_YELLOW,
    label: 'Vàng',
    color: '#FFF09B'
  },
  {
    value: SUBTITLE_BACKGROUND_COLOR_WHITE,
    label: 'Trắng',
    color: '#FFFFFF'
  },
  {
    value: SUBTITLE_BACKGROUND_COLOR_BLACK,
    label: 'Đen',
    color: '#000000'
  }
];
