import envConfig from '@/config';

const apiUrl = envConfig.NEXT_PUBLIC_API;
const mediaUrl = envConfig.NEXT_PUBLIC_API_MEDIA;
const videoUrl = envConfig.NEXT_PUBLIC_API_VIDEO;

const AppConstants = {
  apiUrl,
  contentRootUrl: `${apiUrl}v1/file/download`,
  mediaRootUrl: `${mediaUrl}`,
  videoRootUrl: `${videoUrl}`
};

export default AppConstants;
