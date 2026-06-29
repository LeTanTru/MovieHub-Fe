import { roomApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import { RoomBodyType } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCheckRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CHECK_ROOM],
    mutationFn: () => roomApiRequest.check()
  });
};

export const useCreateRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.ROOM_CREATE],
    mutationFn: (body: RoomBodyType) => roomApiRequest.create(body)
  });
};

export const useDeleteRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.ROOM_DELETE],
    mutationFn: (id: string) => roomApiRequest.deleteById(id)
  });
};

export const useEndRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.ROOM_END],
    mutationFn: (id: string) => roomApiRequest.end(id)
  });
};

export const useRoomByCodeQuery = ({
  code,
  enabled
}: {
  code: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.ROOM, 'code', code],
    queryFn: ({ signal }) => roomApiRequest.getByCode(code, signal),
    enabled: enabled !== undefined ? enabled : !!code,
    select: (data) => data.data
  });
};

export const useRoomQuery = ({
  id,
  enabled
}: {
  id: string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.ROOM, 'id', id],
    queryFn: ({ signal }) => roomApiRequest.getById(id, signal),
    enabled: enabled !== undefined ? enabled : !!id,
    select: (data) => data.data
  });
};

export const useJoinRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.ROOM_JOIN],
    mutationFn: (id: string) => roomApiRequest.join(id)
  });
};

export const useStartRoomMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.ROOM_START],
    mutationFn: (id: string) => roomApiRequest.start(id)
  });
};
