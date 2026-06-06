import { favouriteApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  FavouriteDeleteType,
  FavouriteBodyType,
  FavouriteGetType,
  FavouriteSearchType
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useFavouriteMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.CREATE_FAVOURITE],
    mutationFn: (body: FavouriteBodyType) => favouriteApiRequest.create(body)
  });
};

export const useDeleteFavouriteMutation = () => {
  return useMutation({
    mutationKey: [queryKeys.DELETE_FAVOURITE],
    mutationFn: (params: FavouriteDeleteType) =>
      favouriteApiRequest.deleteById(params)
  });
};

export const useFavouriteQuery = ({
  params,
  enabled
}: {
  params: FavouriteGetType;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [queryKeys.FAVOURITE, params],
    queryFn: ({ signal }) => favouriteApiRequest.get(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useFavouriteListQuery = ({
  params = {},
  enabled
}: {
  params?: FavouriteSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.FAVOURITE_LIST, params],
    queryFn: ({ signal }) => favouriteApiRequest.getList(params, signal),
    enabled,
    select: (data) => data.data
  });
};

export const useFavouriteListIdsQuery = ({
  params = {},
  enabled
}: {
  params?: FavouriteSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.FAVOURITE_GET_LIST_IDS, params],
    queryFn: ({ signal }) => favouriteApiRequest.getListIds(params, signal),
    enabled,
    select: (data) => data.data
  });
};
