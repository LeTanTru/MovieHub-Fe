import { apiConfig } from '@/constants';
import { ApiResponse, SettingBodyType } from '@/types';
import { http } from '@/utils';

const settingApiRequest = {
  updateSetting: (body: SettingBodyType) =>
    http.put<ApiResponse<any>>(apiConfig.user.updateSetting, {
      body
    })
};

export default settingApiRequest;
