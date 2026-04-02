import useUserSettings from './use-user-settings';
import { storageKeys } from '@/constants';
import { getData, setData } from '@/utils';
import { useEffect, useReducer } from 'react';

type PlayerSettings = {
  autoNextEpisode: boolean;
  skipIntro: boolean;
};

type PlayerSettingsAction =
  | { type: 'TOGGLE_AUTO_NEXT_EPISODE' }
  | { type: 'TOGGLE_SKIP_INTRO' }
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
    case 'LOAD_SETTINGS':
      return action.payload;
    default:
      return state;
  }
}

const usePlayerSettings = () => {
  const userSettings = useUserSettings();

  const [settings, dispatchSettings] = useReducer(playerSettingsReducer, {
    autoNextEpisode: userSettings.autoNextEpisode || false,
    skipIntro: userSettings.autoSkipIntro || false
  });

  const { autoNextEpisode, skipIntro } = settings;

  useEffect(() => {
    dispatchSettings({
      type: 'LOAD_SETTINGS',
      payload: {
        autoNextEpisode:
          getData(storageKeys.WATCH_AUTO_NEXT_EPISODE) === 'true' ||
          userSettings.autoNextEpisode,
        skipIntro:
          getData(storageKeys.WATCH_SKIP_INTRO) === 'true' ||
          userSettings.autoSkipIntro
      }
    });
  }, [userSettings.autoNextEpisode, userSettings.autoSkipIntro]);

  const handleToggleAutoNextEpisode = () => {
    dispatchSettings({ type: 'TOGGLE_AUTO_NEXT_EPISODE' });
    setData(storageKeys.WATCH_AUTO_NEXT_EPISODE, String(!autoNextEpisode));
  };

  const handleToggleSkipIntro = () => {
    dispatchSettings({ type: 'TOGGLE_SKIP_INTRO' });
    setData(storageKeys.WATCH_SKIP_INTRO, String(!skipIntro));
  };

  return {
    autoNextEpisode,
    skipIntro,
    handleToggleAutoNextEpisode,
    handleToggleSkipIntro
  };
};

export default usePlayerSettings;
