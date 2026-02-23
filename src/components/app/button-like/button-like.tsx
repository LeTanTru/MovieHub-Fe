'use client';

import { HeartIcon } from '@/assets';
import { Button, ToolTip } from '@/components/form';
import { FAVOURITE_TYPE_MOVIE, FAVOURITE_TYPE_PERSON } from '@/constants';
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
import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const buttonVariants = cva('', {
  variants: {
    variant: {
      detail:
        'hover:text-golden-glow h-fit min-w-20 flex-col px-2 text-xs hover:bg-white/10',
      home: '',
      person:
        'hover:text-golden-glow hover:border-golden-glow rounded-full py-2 text-white',
      popup:
        'hover:border-golden-glow hover:text-golden-glow border border-white/50 text-white hover:bg-transparent',
      watch: 'hover:text-golden-glow border-none bg-transparent! text-white'
    }
  }
});

const iconVariants = cva('', {
  variants: {
    variant: {
      detail: '',
      home: 'size-5 transition-all duration-200 ease-linear',
      person: '',
      popup: '',
      watch: ''
    }
  }
});

const textVariants: Record<string, string> = {
  detail: 'Yêu thích',
  home: '',
  person: 'Thích',
  popup: 'Thích',
  watch: 'Thích'
};

const entityTypeVariants: Record<string, number> = {
  detail: FAVOURITE_TYPE_MOVIE,
  home: FAVOURITE_TYPE_MOVIE,
  person: FAVOURITE_TYPE_PERSON,
  popup: FAVOURITE_TYPE_MOVIE,
  watch: FAVOURITE_TYPE_MOVIE
};

const entityTypeLabels: Record<string, string> = {
  detail: 'phim',
  home: 'phim',
  person: 'diễn viên',
  popup: 'phim',
  watch: 'phim'
};

export default function ButtonLike({
  targetId,
  className,
  refetch,
  variant = 'detail',
  text,
  showTooltip = true
}: {
  targetId: string;
  className?: string;
  refetch?: boolean;
  text?: string;
  showTooltip?: boolean;
} & VariantProps<typeof buttonVariants>) {
  const { iconRef, startAnimation } = useClickAnimation();
  const [isLiked, setIsLiked] = useState(false);
  const [favouriteId, setFavouriteId] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const favouriteType: number = variant
    ? entityTypeVariants[variant]
    : FAVOURITE_TYPE_MOVIE;
  const entityTypeLabel = variant ? entityTypeLabels[variant] : 'phim';
  const defaultText = variant ? textVariants[variant] : 'Thích';

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteData, refetch: getFavourite } = useFavouriteQuery({
    params: {
      targetId,
      type: favouriteType
    },
    enabled: variant === 'popup' ? false : !!targetId && isAuthenticated
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (refetch && !hasFetched.current && isAuthenticated) {
      hasFetched.current = true;
      getFavourite();
    }
  }, [getFavourite, refetch, isAuthenticated]);

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
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để thêm {entityTypeLabel} vào danh sách yêu thích
        </span>
      );
      return;
    }

    if (addFavouriteLoading) return;

    await addFavourite(
      { targetId, type: favouriteType },
      {
        onSuccess: (res) => {
          if (res.result) {
            notify.success(
              `Thêm ${entityTypeLabel} vào danh sách yêu thích thành công`
            );
            setIsLiked(true);
            setFavouriteId(res.data ?? '');
          } else {
            notify.error(
              `Thêm ${entityTypeLabel} vào danh sách yêu thích thất bại`
            );
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
            className='text-golden-glow transition-all duration-200 ease-linear hover:opacity-80'
            href={route.login.path}
          >
            đăng nhập
          </Link>
          &nbsp;để xóa {entityTypeLabel} khỏi danh sách yêu thích
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
            notify.success(
              `Xóa ${entityTypeLabel} khỏi danh sách yêu thích thành công`
            );
          } else {
            notify.error(
              `Xóa ${entityTypeLabel} khỏi danh sách yêu thích thất bại`
            );
          }
        },
        onError: (error) => {
          logger.error('Error while removing favourite', error);
          notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
        }
      });
    }
  };

  const handleClick = () => {
    if (isLiked) {
      handleRemoveLike();
    } else {
      handleLike();
    }
  };

  // Home variant has special rendering
  if (variant === 'home') {
    return (
      <button className={cn('item group', className)} onClick={handleClick}>
        <div className='inc-icon icon-20'>
          <HeartIcon
            ref={iconRef}
            iconClassName={cn(iconVariants({ variant }), {
              'text-golden-glow stroke-0': isLiked,
              'text-white group-hover:text-golden-glow group-hover:stroke-0':
                !isLiked
            })}
          />
        </div>
      </button>
    );
  }

  const buttonContent = (
    <Button
      className={cn(
        buttonVariants({ variant }),
        {
          'text-golden-glow disabled:opacity-80': isLiked,
          'text-golden-glow border-golden-glow disabled:opacity-80':
            isLiked && (variant === 'person' || variant === 'popup')
        },
        className
      )}
      variant={variant === 'person' ? 'outline' : 'ghost'}
      onClick={handleClick}
    >
      <HeartIcon ref={iconRef} />
      {text || defaultText}
    </Button>
  );

  // Variants that show tooltip
  if (
    showTooltip &&
    (variant === 'detail' || variant === 'person' || variant === 'watch')
  ) {
    return (
      <ToolTip
        className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
        title='Thêm vào danh sách yêu thích để nhận thông báo cập nhật về phim nhé'
        side='bottom'
      >
        {buttonContent}
      </ToolTip>
    );
  }

  return buttonContent;
}
