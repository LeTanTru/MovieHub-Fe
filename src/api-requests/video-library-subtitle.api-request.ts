import { apiConfig } from '@/constants';
import type {
  ApiResponseList,
  VideoLibrarySubtitleResType,
  VideoLibrarySubtitleSearchType
} from '@/types';
import { http } from '@/utils';

export const getList = (
  params: VideoLibrarySubtitleSearchType,
  signal?: AbortSignal
) =>
  http.get<ApiResponseList<VideoLibrarySubtitleResType>>(
    apiConfig.videoLibrarySubtitle.getList,
    {
      params,
      signal
    }
  );
