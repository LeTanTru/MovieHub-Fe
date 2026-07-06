import { participantApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { ParticipantSearchType } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useParticipantListQuery = ({
  params = {},
  enabled
}: {
  params?: ParticipantSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.PARTICIPANT_LIST, params],
    queryFn: ({ signal }) => participantApiRequest.getList(params, signal),
    enabled,
    select: (data) => data?.data?.content || []
  });
};
