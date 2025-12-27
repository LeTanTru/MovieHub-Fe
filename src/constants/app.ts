import envConfig from '@/config';

const apiUrl = envConfig.NEXT_PUBLIC_API_URL;
const mediaUrl = envConfig.NEXT_PUBLIC_API_MEDIA_URL;

const AppConstants = {
  apiUrl: `${apiUrl}`,
  mediaUrl: `${mediaUrl}`,
  contentRootUrl: `${mediaUrl}v1/file/download`,
  publicContentUrl: `${mediaUrl}/v1/file/public-download`,
  videoRootUrl: `${mediaUrl}/v1/file/download-video-resource`,
  loginType: 1
};

export default AppConstants;
