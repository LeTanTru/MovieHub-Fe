import { favouriteApiRequest } from '@/api-requests';
import { queryKeys } from '@/constants';
import {
  FavoriteDeleteType,
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
    mutationFn: (params: FavoriteDeleteType) =>
      favouriteApiRequest.delete(params)
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
    queryFn: () => favouriteApiRequest.get(params),
    enabled
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
    queryFn: () => favouriteApiRequest.getList(params),
    enabled
  });
};

export const useFavouriteGetListIdsQuery = ({
  params = {},
  enabled
}: {
  params?: FavouriteSearchType;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    queryKey: [queryKeys.FAVOURITE_GET_LIST_IDS, params],
    queryFn: () => favouriteApiRequest.getListIds(params),
    enabled
  });
};
