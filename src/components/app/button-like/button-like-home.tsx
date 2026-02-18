'use client';

import { HeartIcon } from '@/assets';
import { cn } from '@/lib';
import { useEffect, useState } from 'react';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { notify } from '@/utils';
import { route } from '@/routes';
import { FAVOURITE_TYPE_MOVIE } from '@/constants';
import { useAuth, useClickAnimation } from '@/hooks';
import Link from 'next/link';
import { logger } from '@/logger';

export default function ButtonLikeHome({
  targetId,
  className
}: {
  targetId: string;
  className?: string;
}) {
  const { iconRef, startAnimation } = useClickAnimation();
  const [isLiked, setIsLiked] = useState(false);
  const [favouriteId, setFavouriteId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteData } = useFavouriteQuery({
    params: {
      targetId: targetId,
      type: FAVOURITE_TYPE_MOVIE
    },
    enabled: !!targetId && isAuthenticated
  });

  useEffect(() => {
    setIsLiked(!!favouriteData?.result && isAuthenticated);
    setFavouriteId(favouriteData?.data?.id ?? '');
  }, [favouriteData, isAuthenticated]);

  const handleLike = async () => {
    startAnimation();

    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thêm phim vào danh sách yêu thích
        </span>
      );
      return;
    }

    if (addFavouriteLoading) return;

    await addFavourite(
      { targetId: targetId, type: FAVOURITE_TYPE_MOVIE },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Thêm phim vào danh sách yêu thích thành công');
            setIsLiked(true);
            setFavouriteId(res.data ?? '');
          } else {
            notify.error('Thêm phim vào danh sách yêu thích thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while adding favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      }
    );
  };

  const handleRemoveLike = async () => {
    if (!isAuthenticated) {
      notify.error(
        <span>
          Vui lòng&nbsp;
          <Link
            className='text-light-golden-yellow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để xóa phim khỏi danh sách yêu thích
        </span>
      );
      return;
    }

    if (removeFavouriteLoading) return;

    if (favouriteId) {
      startAnimation();

      await removeFavourite(favouriteId, {
        onSuccess: (res) => {
          if (res.result) {
            setIsLiked(false);
            notify.success('Xóa phim khỏi danh sách yêu thích thành công');
          } else {
            notify.error('Xóa phim khỏi danh sách yêu thích thất bại');
          }
        },
        onError: (error) => {
          logger.error('Error while removing favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      });
    }
  };

  const handleFavouriteClick = () => {
    if (isLiked) {
      handleRemoveLike();
    } else {
      handleLike();
    }
  };

  return (
    <button
      className={cn('item group', className)}
      onClick={handleFavouriteClick}
    >
      <div className='inc-icon icon-20'>
        <HeartIcon
          ref={iconRef}
          iconClassName={cn(`size-5 transition-all duration-200 ease-linear`, {
            'text-light-golden-yellow stroke-0': isLiked,
            'text-white group-hover:text-light-golden-yellow group-hover:stroke-0':
              !isLiked
          })}
        />
      </div>
    </button>
  );
}
