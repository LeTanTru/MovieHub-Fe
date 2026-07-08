import { settingsSchema } from '@/schemaValidations/settings.schema';
import z from 'zod';

export type SettingBodyType = z.infer<typeof settingsSchema>;

export type SettingResType = {
  autoSkipIntro: boolean;
  autoNextEpisode: boolean;
  resolution: number;
  brightness: number;
  audio: number;
  playbackSpeed: number;
  subtitleEnabled: boolean;
  subtitleFontSize: number;
  subtitleBackgroundColor: number;
  subtitleTextColor: number;
};

export type PublicSettingResType = {
  id: string;
  groupName: string;
  description: string;
  keyName: string;
  valueData: string;
};
