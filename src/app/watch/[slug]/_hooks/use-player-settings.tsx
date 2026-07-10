import {
  storageKeys,
  SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
  SUBTITLE_FONT_SIZE_SMALL,
  SUBTITLE_TEXT_COLOR_YELLOW
} from '@/constants';
import { useAuth } from '@/hooks';
import type { SettingResType } from '@/types';
import { getData, setData } from '@/utils';
import { useEffect, useReducer } from 'react';

type PlayerSettings = {
  autoNextEpisode: boolean;
  skipIntro: boolean;
  brightness: number;
  subtitleEnabled: boolean;
  subtitleFontSize: number;
  subtitleTextColor: number;
  subtitleBackgroundColor: number;
};

type PlayerSettingsAction =
  | { type: 'TOGGLE_AUTO_NEXT_EPISODE' }
  | { type: 'TOGGLE_SKIP_INTRO' }
  | { type: 'TOGGLE_SUBTITLE_ENABLED' }
  | { type: 'SET_BRIGHTNESS'; payload: number }
  | { type: 'SET_SUBTITLE_FONT_SIZE'; payload: number }
  | { type: 'SET_SUBTITLE_TEXT_COLOR'; payload: number }
  | { type: 'SET_SUBTITLE_BACKGROUND_COLOR'; payload: number }
  | { type: 'LOAD_SETTINGS'; payload: PlayerSettings };

function playerSettingsReducer(
  state: PlayerSettings,
  action: PlayerSettingsAction
): PlayerSettings {
  switch (action.type) {
    case 'TOGGLE_AUTO_NEXT_EPISODE':
      return { ...state, autoNextEpisode: !state.autoNextEpisode };
    case 'TOGGLE_SKIP_INTRO':
      return { ...state, skipIntro: !state.skipIntro };
    case 'TOGGLE_SUBTITLE_ENABLED':
      return { ...state, subtitleEnabled: !state.subtitleEnabled };
    case 'SET_BRIGHTNESS':
      return { ...state, brightness: action.payload };
    case 'SET_SUBTITLE_FONT_SIZE':
      return { ...state, subtitleFontSize: action.payload };
    case 'SET_SUBTITLE_TEXT_COLOR':
      return { ...state, subtitleTextColor: action.payload };
    case 'SET_SUBTITLE_BACKGROUND_COLOR':
      return { ...state, subtitleBackgroundColor: action.payload };
    case 'LOAD_SETTINGS':
      return action.payload;
    default:
      return state;
  }
}

function loadStored<T>(key: string, fallback: T, parse: (raw: string) => T): T {
  const raw = getData(key);
  return raw !== null ? parse(raw) : fallback;
}

const parseBoolean = (raw: string) => raw === 'true';

export const usePlayerSettings = () => {
  const { profile } = useAuth();
  const userSettings: SettingResType = JSON.parse(profile?.settings || '{}');

  const [settings, dispatchSettings] = useReducer(playerSettingsReducer, {
    autoNextEpisode: userSettings.autoNextEpisode || false,
    skipIntro: userSettings.autoSkipIntro || false,
    brightness: userSettings.brightness ?? 100,
    subtitleEnabled: userSettings.subtitleEnabled ?? true,
    subtitleFontSize: userSettings.subtitleFontSize ?? SUBTITLE_FONT_SIZE_SMALL,
    subtitleTextColor:
      userSettings.subtitleTextColor ?? SUBTITLE_TEXT_COLOR_YELLOW,
    subtitleBackgroundColor:
      userSettings.subtitleBackgroundColor ??
      SUBTITLE_BACKGROUND_COLOR_TRANSPARENT
  });

  const {
    autoNextEpisode,
    skipIntro,
    brightness,
    subtitleEnabled,
    subtitleFontSize,
    subtitleTextColor,
    subtitleBackgroundColor
  } = settings;

  useEffect(() => {
    dispatchSettings({
      type: 'LOAD_SETTINGS',
      payload: {
        autoNextEpisode: loadStored(
          storageKeys.WATCH_AUTO_NEXT_EPISODE,
          userSettings.autoNextEpisode,
          parseBoolean
        ),
        skipIntro: loadStored(
          storageKeys.WATCH_SKIP_INTRO,
          userSettings.autoSkipIntro,
          parseBoolean
        ),
        brightness: loadStored(
          storageKeys.WATCH_BRIGHTNESS,
          userSettings.brightness ?? 100,
          Number
        ),
        subtitleEnabled: loadStored(
          storageKeys.WATCH_SUBTITLE_ENABLED,
          userSettings.subtitleEnabled ?? true,
          parseBoolean
        ),
        subtitleFontSize: loadStored(
          storageKeys.WATCH_SUBTITLE_FONT_SIZE,
          userSettings.subtitleFontSize ?? SUBTITLE_FONT_SIZE_SMALL,
          Number
        ),
        subtitleTextColor: loadStored(
          storageKeys.WATCH_SUBTITLE_TEXT_COLOR,
          userSettings.subtitleTextColor ?? SUBTITLE_TEXT_COLOR_YELLOW,
          Number
        ),
        subtitleBackgroundColor: loadStored(
          storageKeys.WATCH_SUBTITLE_BACKGROUND_COLOR,
          userSettings.subtitleBackgroundColor ??
            SUBTITLE_BACKGROUND_COLOR_TRANSPARENT,
          Number
        )
      }
    });
  }, [
    userSettings.autoNextEpisode,
    userSettings.autoSkipIntro,
    userSettings.brightness,
    userSettings.subtitleEnabled,
    userSettings.subtitleFontSize,
    userSettings.subtitleTextColor,
    userSettings.subtitleBackgroundColor
  ]);

  const dispatchAndPersist = (
    action: PlayerSettingsAction,
    key: string,
    value: string
  ) => {
    dispatchSettings(action);
    setData(key, value);
  };

  const handleToggleAutoNextEpisode = () =>
    dispatchAndPersist(
      { type: 'TOGGLE_AUTO_NEXT_EPISODE' },
      storageKeys.WATCH_AUTO_NEXT_EPISODE,
      String(!autoNextEpisode)
    );

  const handleToggleSkipIntro = () =>
    dispatchAndPersist(
      { type: 'TOGGLE_SKIP_INTRO' },
      storageKeys.WATCH_SKIP_INTRO,
      String(!skipIntro)
    );

  const handleChangeBrightness = (value: number) =>
    dispatchAndPersist(
      { type: 'SET_BRIGHTNESS', payload: value },
      storageKeys.WATCH_BRIGHTNESS,
      String(value)
    );

  const handleToggleSubtitleEnabled = () =>
    dispatchAndPersist(
      { type: 'TOGGLE_SUBTITLE_ENABLED' },
      storageKeys.WATCH_SUBTITLE_ENABLED,
      String(!subtitleEnabled)
    );

  const handleChangeSubtitleFontSize = (value: number) =>
    dispatchAndPersist(
      { type: 'SET_SUBTITLE_FONT_SIZE', payload: value },
      storageKeys.WATCH_SUBTITLE_FONT_SIZE,
      String(value)
    );

  const handleChangeSubtitleTextColor = (value: number) =>
    dispatchAndPersist(
      { type: 'SET_SUBTITLE_TEXT_COLOR', payload: value },
      storageKeys.WATCH_SUBTITLE_TEXT_COLOR,
      String(value)
    );

  const handleChangeSubtitleBackgroundColor = (value: number) =>
    dispatchAndPersist(
      { type: 'SET_SUBTITLE_BACKGROUND_COLOR', payload: value },
      storageKeys.WATCH_SUBTITLE_BACKGROUND_COLOR,
      String(value)
    );

  return {
    ...userSettings,
    autoNextEpisode,
    skipIntro,
    brightness,
    subtitleEnabled,
    subtitleFontSize,
    subtitleTextColor,
    subtitleBackgroundColor,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro,
    handleChangeBrightness,
    handleToggleSubtitleEnabled,
    handleChangeSubtitleFontSize,
    handleChangeSubtitleTextColor,
    handleChangeSubtitleBackgroundColor
  };
};
