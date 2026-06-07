import { videoLibrarySubtitleApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import type { VideoLibrarySubtitleSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useVideoLibrarySubtitleListQuery = ({
  params,
  enabled
}: {
  params: VideoLibrarySubtitleSearchType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.VIDEO_LIBRARY_SUBTITLE_LIST, params],
    queryFn: ({ signal }) =>
      videoLibrarySubtitleApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data
  });
};
