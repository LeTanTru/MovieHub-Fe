'use client';

import { HeartIcon } from '@/assets';
import { Button, ToolTip } from '@/components/form';
import { FAVOURITE_TYPE_PERSON } from '@/constants';
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

export default function ButtonLikePerson({
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
      type: FAVOURITE_TYPE_PERSON
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
      { targetId, type: FAVOURITE_TYPE_PERSON },
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
  }, [addFavourite, isAuthenticated, targetId]);

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
  }, [favouriteId, isAuthenticated, removeFavourite]);

  return (
    <ToolTip
      className='w-fit bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
      title='Thêm vào danh sách yêu thích để nhận thông báo cập nhật về phim nhé'
      side='top'
    >
      <Button
        className={cn(
          'dark:hover:text-light-golden-yellow dark:hover:border-light-golden-yellow rounded-full py-2 text-white',
          {
            'dark:text-light-golden-yellow dark:border-light-golden-yellow dark:disabled:opacity-80':
              isLiked
          },
          className
        )}
        variant='outline'
        onClick={isLiked ? handleUnlike : handleLike}
        disabled={addFavouriteLoading || removeFavouriteLoading}
      >
        <HeartIcon ref={heartIconRef} />
        Thích
      </Button>
    </ToolTip>
  );
}
