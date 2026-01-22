import envConfig from '@/config';
import { GOOGLE_WEB_LOGIN_TYPE } from '@/constants/constant';

const metaApiUrl = envConfig.NEXT_PUBLIC_API_META_ENDPOINT_URL;
const apiUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT_URL;
const mediaUrl = envConfig.NEXT_PUBLIC_API_MEDIA_ENDPOINT_URL;

const AppConstants = {
  metaApiUrl: `${metaApiUrl}`,
  apiUrl: `${apiUrl}`,
  mediaUrl: `${mediaUrl}`,
  contentRootUrl: `${mediaUrl}v1/file/download`,
  publicContentUrl: `${mediaUrl}/v1/file/public-download`,
  videoRootUrl: `${mediaUrl}/v1/file/download-video-resource`,
  loginType: GOOGLE_WEB_LOGIN_TYPE
};

export default AppConstants;
