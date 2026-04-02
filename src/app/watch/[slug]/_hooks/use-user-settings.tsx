import { useAuth } from '@/hooks';
import { SettingResType } from '@/types';

const useUserSettings = () => {
  const { profile } = useAuth();
  const settings: SettingResType = JSON.parse(profile?.settings || '{}');
  return settings;
};

export default useUserSettings;
