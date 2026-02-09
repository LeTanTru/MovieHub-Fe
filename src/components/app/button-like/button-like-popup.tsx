'use client';

import { HeartIcon } from '@/assets';
import { Button } from '@/components/form';
import { FAVOURITE_TYPE_MOVIE } from '@/constants/constant';
import { useAuth } from '@/hooks';
import { cn } from '@/lib';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { AnimatedIconHandle } from '@/types';
import { notify } from '@/utils';
import { useEffect, useRef, useState } from 'react';

export default function ButtonLikePopup({
  targetId,
  className,
  refetch
}: {
  targetId: string;
  className?: string;
  refetch?: boolean;
}) {
  const heartIconRef = useRef<AnimatedIconHandle>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [favouriteId, setFavouriteId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteData, refetch: getFavourite } = useFavouriteQuery(
    {
      targetId,
      type: FAVOURITE_TYPE_MOVIE
    },
    false
  );

  const hasFetched = useRef(false);

  useEffect(() => {
    if (refetch && !hasFetched.current && isAuthenticated) {
      hasFetched.current = true;
      getFavourite();
    }
  }, [getFavourite, refetch, isAuthenticated]);

  useEffect(() => {
    setIsLiked(!!favouriteData?.result);
    setFavouriteId(favouriteData?.data?.id ?? '');
  }, [favouriteData]);

  const handleLike = async () => {
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
  };

  const handleUnlike = async () => {
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
  };

  return (
    <Button
      className={cn(
        'border border-white/50 bg-transparent! text-white',
        {
          'text-light-golden-yellow border-light-golden-yellow dark:disabled:opacity-80':
            isLiked
        },
        className
      )}
      onClick={isLiked ? handleUnlike : handleLike}
      disabled={addFavouriteLoading || removeFavouriteLoading}
    >
      <HeartIcon ref={heartIconRef} />
      Thích
    </Button>
  );
}
