import {
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  SUBTITLE_FONT_SIZE_SMALL,
  SUBTITLE_TEXT_COLOR_YELLOW,
  VIDEO_QUALITY_AUTO
} from '@/constants';
import z from 'zod';

export const settingsSchema = z.object({
  audio: z.number().default(0),
  autoNextEpisode: z.boolean().default(true),
  autoSkipIntro: z.boolean().default(true),
  brightness: z.number().default(0),
  playbackSpeed: z.number().default(0),
  resolution: z.number().default(VIDEO_QUALITY_AUTO),
  subtitleBackgroundColor: z
    .number()
    .default(SUBTITLE_BACKGROUND_COLOR_TRANSPARENT),
  subtitleEnabled: z.boolean().default(true),
  subtitleFontSize: z.number().default(SUBTITLE_FONT_SIZE_SMALL),
  subtitleTextColor: z.number().default(SUBTITLE_TEXT_COLOR_YELLOW)
});
