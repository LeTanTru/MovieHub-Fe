'use client';

import { HeartIcon } from '@/assets';
import { Button, ToolTip } from '@/components/form';
import { FAVOURITE_TYPE_MOVIE } from '@/constants';
import { useAuth, useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { route } from '@/routes';
import { notify } from '@/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ButtonLikeWatch({
  targetId,
  className,
  text
}: {
  targetId: string;
  className?: string;
  text?: string;
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
      targetId,
      type: FAVOURITE_TYPE_MOVIE
    },
    enabled: isAuthenticated
  });

  useEffect(() => {
    setIsLiked(!!favouriteData?.result);
    setFavouriteId(favouriteData?.data?.id ?? '');
  }, [favouriteData]);

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
      { targetId, type: FAVOURITE_TYPE_MOVIE },
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

  return (
    <ToolTip
      className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
      title='Thêm vào danh sách yêu thích để nhận thông báo cập nhật về phim nhé'
      side='top'
    >
      <Button
        className={cn(
          'hover:text-light-golden-yellow border-none bg-transparent! text-white',
          {
            'text-light-golden-yellow disabled:opacity-80': isLiked
          },
          className
        )}
        onClick={isLiked ? handleRemoveLike : handleLike}
      >
        <HeartIcon ref={iconRef} />
        {text || 'Thích'}
      </Button>
    </ToolTip>
  );
}
