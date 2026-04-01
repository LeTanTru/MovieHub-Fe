import { settingSchema } from '@/schemaValidations';
import z from 'zod';

export type SettingBodyType = z.infer<typeof settingSchema>;

export type SettingResType = {
  autoSkipIntro: boolean;
  autoNextEpisode: boolean;
  resolution: number;
  brightness: number;
  audio: number;
  playbackSpeed: number;
};
