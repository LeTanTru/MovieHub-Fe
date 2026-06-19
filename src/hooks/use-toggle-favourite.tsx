'use client';

import Link from 'next/link';
import { FAVOURITE_TYPE_MOVIE, queryKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useDeleteFavouriteMutation,
  useFavouriteListIdsQuery,
  useFavouriteMutation
} from '@/queries';
import { buildLoginRedirectPath, invalidateQueries, notify } from '@/utils';
import { useAuth } from './use-auth';

export const useToggleFavourite = (type: number = FAVOURITE_TYPE_MOVIE) => {
  const { isAuthenticated } = useAuth();

  const { mutate: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutate: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteListIdsData } = useFavouriteListIdsQuery({
    params: { type },
    enabled: isAuthenticated
  });

  const favouriteListIds = favouriteListIdsData?.ids || [];

  const handleVote = (targetId: string, isLiked: boolean) => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={buildLoginRedirectPath()}
          >
            đăng nhập
          </Link>
          &nbsp;để {isLiked ? 'xóa phim khỏi' : 'thêm phim vào'} danh sách yêu
          thích
        </span>
      );
      return;
    }

    const mutate = isLiked ? removeFavourite : addFavourite;
    const loading = isLiked ? removeFavouriteLoading : addFavouriteLoading;

    if (loading) return;

    mutate(
      { targetId, type },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thành công`
            );
            invalidateQueries(
              [queryKeys.FAVOURITE_GET_LIST_IDS],
              [queryKeys.FAVOURITE_LIST],
              [queryKeys.FAVOURITE, { targetId, type }]
            );
          } else {
            notify.error(
              `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error(
            `[${isLiked ? 'REMOVE' : 'ADD'}_FAVOURITE_ERROR]`,
            error
          );
          notify.error(
            `${isLiked ? 'Xóa phim khỏi' : 'Thêm phim vào'} danh sách yêu thích thất bại`
          );
        }
      }
    );
  };

  return {
    favouriteListIds,
    handleVote,
    isLoading: addFavouriteLoading || removeFavouriteLoading
  };
};
