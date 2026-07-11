import {
  BRIGHTNESS_MAX,
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  SUBTITLE_FONT_SIZE_SMALL,
  SUBTITLE_TEXT_COLOR_YELLOW,
  VIDEO_QUALITY_AUTO
} from '@/constants';
import { useAuth } from './use-auth';
import type { SettingResType } from '@/types';
import { useEffect, useReducer } from 'react';

type PlayerSettings = {
  audio: number;
  autoNextEpisode: boolean;
  brightness: number;
  playbackSpeed: number;
  resolution: number;
  skipIntro: boolean;
  subtitleBackgroundColor: number;
  subtitleEnabled: boolean;
  subtitleFontSize: number;
  subtitleTextColor: number;
};

type PlayerSettingsAction =
  | { type: 'LOAD_SETTINGS'; payload: PlayerSettings }
  | { type: 'SET_AUDIO'; payload: number }
  | { type: 'SET_BRIGHTNESS'; payload: number }
  | { type: 'SET_PLAYBACK_SPEED'; payload: number }
  | { type: 'SET_RESOLUTION'; payload: number }
  | { type: 'SET_SUBTITLE_BACKGROUND_COLOR'; payload: number }
  | { type: 'SET_SUBTITLE_FONT_SIZE'; payload: number }
  | { type: 'SET_SUBTITLE_TEXT_COLOR'; payload: number }
  | { type: 'TOGGLE_AUTO_NEXT_EPISODE' }
  | { type: 'TOGGLE_SKIP_INTRO' }
  | { type: 'TOGGLE_SUBTITLE_ENABLED' };

function playerSettingsReducer(
  state: PlayerSettings,
  action: PlayerSettingsAction
): PlayerSettings {
  switch (action.type) {
    case 'LOAD_SETTINGS':
      return action.payload;
    case 'SET_AUDIO':
      return { ...state, audio: action.payload };
    case 'SET_BRIGHTNESS':
      return { ...state, brightness: action.payload };
    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.payload };
    case 'SET_RESOLUTION':
      return { ...state, resolution: action.payload };
    case 'SET_SUBTITLE_BACKGROUND_COLOR':
      return { ...state, subtitleBackgroundColor: action.payload };
    case 'SET_SUBTITLE_FONT_SIZE':
      return { ...state, subtitleFontSize: action.payload };
    case 'SET_SUBTITLE_TEXT_COLOR':
      return { ...state, subtitleTextColor: action.payload };
    case 'TOGGLE_AUTO_NEXT_EPISODE':
      return { ...state, autoNextEpisode: !state.autoNextEpisode };
    case 'TOGGLE_SKIP_INTRO':
      return { ...state, skipIntro: !state.skipIntro };
    case 'TOGGLE_SUBTITLE_ENABLED':
      return { ...state, subtitleEnabled: !state.subtitleEnabled };
    default:
      return state;
  }
}

function parseSettings(raw: string | undefined): PlayerSettings {
  const s: Partial<SettingResType> = JSON.parse(raw || '{}');
  return {
    audio: s.audio ?? 100,
    autoNextEpisode: s.autoNextEpisode ?? false,
    brightness: s.brightness ?? BRIGHTNESS_MAX,
    playbackSpeed: s.playbackSpeed ?? 1,
    resolution: s.resolution ?? VIDEO_QUALITY_AUTO,
    skipIntro: s.autoSkipIntro ?? false,
    subtitleBackgroundColor:
      s.subtitleBackgroundColor ?? SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
    subtitleEnabled: s.subtitleEnabled ?? true,
    subtitleFontSize: s.subtitleFontSize ?? SUBTITLE_FONT_SIZE_SMALL,
    subtitleTextColor: s.subtitleTextColor ?? SUBTITLE_TEXT_COLOR_YELLOW
  };
}

export const usePlayerSettings = () => {
  const { profile } = useAuth();

  const [settings, dispatchSettings] = useReducer(
    playerSettingsReducer,
    profile?.settings,
    parseSettings
  );

  useEffect(() => {
    if (!profile?.settings) return;

    dispatchSettings({
      type: 'LOAD_SETTINGS',
      payload: parseSettings(profile.settings)
    });
  }, [profile?.settings]);

  const handleChangeAudio = (value: number) =>
    dispatchSettings({ type: 'SET_AUDIO', payload: value });

  const handleChangeBrightness = (value: number) =>
    dispatchSettings({ type: 'SET_BRIGHTNESS', payload: value });

  const handleChangePlaybackSpeed = (value: number) =>
    dispatchSettings({ type: 'SET_PLAYBACK_SPEED', payload: value });

  const handleChangeResolution = (value: number) =>
    dispatchSettings({ type: 'SET_RESOLUTION', payload: value });

  const handleChangeSubtitleBackgroundColor = (value: number) =>
    dispatchSettings({ type: 'SET_SUBTITLE_BACKGROUND_COLOR', payload: value });

  const handleChangeSubtitleFontSize = (value: number) =>
    dispatchSettings({ type: 'SET_SUBTITLE_FONT_SIZE', payload: value });

  const handleChangeSubtitleTextColor = (value: number) =>
    dispatchSettings({ type: 'SET_SUBTITLE_TEXT_COLOR', payload: value });

  const handleToggleAutoNextEpisode = () =>
    dispatchSettings({ type: 'TOGGLE_AUTO_NEXT_EPISODE' });

  const handleToggleSkipIntro = () =>
    dispatchSettings({ type: 'TOGGLE_SKIP_INTRO' });

  const handleToggleSubtitleEnabled = () =>
    dispatchSettings({ type: 'TOGGLE_SUBTITLE_ENABLED' });

  return {
    ...settings,
    handleChangeAudio,
    handleChangeBrightness,
    handleChangePlaybackSpeed,
    handleChangeResolution,
    handleChangeSubtitleBackgroundColor,
    handleChangeSubtitleFontSize,
    handleChangeSubtitleTextColor,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro,
    handleToggleSubtitleEnabled
  };
};
