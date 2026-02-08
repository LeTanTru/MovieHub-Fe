'use client';

import { HeartIcon } from '@/assets';
import { Button, ToolTip } from '@/components/form';
import { FAVOURITE_TYPE_MOVIE } from '@/constants';
import { useAuth } from '@/hooks';
import { cn } from '@/lib';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { AnimatedIconHandle } from '@/types';
import { notify } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function ButtonLikeDetail({
  targetId,
  className
}: {
  targetId: string;
  className?: string;
}) {
  const heartIconRef = useRef<AnimatedIconHandle>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [favouriteId, setFavouriteId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteData } = useFavouriteQuery(
    {
      targetId,
      type: FAVOURITE_TYPE_MOVIE
    },
    !!targetId && isAuthenticated
  );

  useEffect(() => {
    setIsLiked(!!favouriteData?.result && isAuthenticated);
    setFavouriteId(favouriteData?.data?.id ?? '');
  }, [favouriteData, isAuthenticated]);

  const handleLike = useCallback(async () => {
    heartIconRef.current?.startAnimation();

    if (!isAuthenticated) {
      notify.error('Vui lòng đăng nhập để sử dụng chức năng này!');
      return;
    }

    await addFavourite(
      { targetId, type: FAVOURITE_TYPE_MOVIE },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success('Thêm vào danh sách yêu thích thành công!');
            setIsLiked(true);
            setFavouriteId(res.data ?? '');
          } else {
            notify.error('Thêm vào danh sách yêu thích thất bại!');
          }
        }
      }
    );
  }, [addFavourite, targetId, isAuthenticated]);

  const handleUnlike = useCallback(async () => {
    if (!isAuthenticated) {
      notify.error('Vui lòng đăng nhập để sử dụng chức năng này!');
      return;
    }

    if (favouriteId) {
      heartIconRef.current?.startAnimation();

      await removeFavourite(favouriteId, {
        onSuccess: (res) => {
          if (res.result) {
            setIsLiked(false);
            notify.success('Xóa khỏi danh sách yêu thích thành công!');
          } else {
            notify.error('Xóa khỏi danh sách yêu thích thất bại!');
          }
        }
      });
    }
  }, [favouriteId, removeFavourite, isAuthenticated]);

  return (
    <ToolTip
      className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
      title='Thêm vào danh sách yêu thích để nhận thông báo cập nhật về phim nhé'
      side='top'
    >
      <Button
        className={cn(
          'hover:text-light-golden-yellow h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10',
          {
            'text-light-golden-yellow dark:disabled:opacity-80': isLiked
          },
          className
        )}
        variant='ghost'
        onClick={isLiked ? handleUnlike : handleLike}
        disabled={addFavouriteLoading || removeFavouriteLoading}
      >
        <HeartIcon ref={heartIconRef} />
        Yêu thích
      </Button>
    </ToolTip>
  );
}
