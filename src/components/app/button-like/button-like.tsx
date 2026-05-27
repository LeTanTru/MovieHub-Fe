'use client';

import { HeartIcon } from '@/assets';
import { Button, ToolTip } from '@/components/form';
import {
  FAVOURITE_TYPE_MOVIE,
  FAVOURITE_TYPE_PERSON,
  queryKeys
} from '@/constants';
import { useAuth, useClickAnimation } from '@/hooks';
import { cn } from '@/lib';
import { logger } from '@/logger';
import {
  useDeleteFavouriteMutation,
  useFavouriteMutation,
  useFavouriteQuery
} from '@/queries';
import { buildLoginRedirectPath, invalidateQueries, notify } from '@/utils';
import { cva, VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const buttonVariants = cva('', {
  variants: {
    variant: {
      detail:
        'hover:text-golden-glow h-fit min-w-20 flex-col px-2 hover:bg-white/10',
      person:
        'hover:text-golden-glow hover:border-golden-glow rounded-full py-2 text-white',
      popup:
        'hover:border-golden-glow hover:text-golden-glow border border-white/50 text-white hover:bg-transparent',
      watch: 'hover:text-golden-glow border-none bg-transparent text-white'
    }
  }
});

const textVariants: Record<string, string> = {
  detail: 'Yêu thích',
  person: 'Thích',
  popup: 'Thích',
  watch: 'Thích'
};

const typeVariants: Record<string, number> = {
  detail: FAVOURITE_TYPE_MOVIE,
  person: FAVOURITE_TYPE_PERSON,
  popup: FAVOURITE_TYPE_MOVIE,
  watch: FAVOURITE_TYPE_MOVIE
};

const labels: Record<string, string> = {
  detail: 'phim',
  person: 'diễn viên',
  popup: 'phim',
  watch: 'phim'
};

type ButtonLikeProps = {
  targetId: string;
  className?: string;
  refetch?: boolean;
  text?: string;
  showTooltip?: boolean;
} & VariantProps<typeof buttonVariants>;

export function ButtonLike({
  targetId,
  className,
  refetch,
  variant = 'detail',
  text,
  showTooltip = true
}: ButtonLikeProps) {
  const { isAuthenticated } = useAuth();

  const { iconRef, startAnimation } = useClickAnimation();
  const [isLiked, setIsLiked] = useState(false);

  const favouriteType: number = variant
    ? typeVariants[variant]
    : FAVOURITE_TYPE_MOVIE;
  const label = variant ? labels[variant] : 'phim';
  const defaultText = variant ? textVariants[variant] : 'Thích';

  const { mutateAsync: addFavourite, isPending: addFavouriteLoading } =
    useFavouriteMutation();

  const { mutateAsync: removeFavourite, isPending: removeFavouriteLoading } =
    useDeleteFavouriteMutation();

  const { data: favouriteId, refetch: getFavourite } = useFavouriteQuery({
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
    setIsLiked(!!favouriteId && isAuthenticated);
  }, [favouriteId, isAuthenticated]);

  const handleVote = async () => {
    startAnimation();

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
          &nbsp;để {isLiked ? 'xóa' : 'thêm'} {label} {isLiked ? 'khỏi' : 'vào'}{' '}
          danh sách yêu thích
        </span>
      );
      return;
    }

    const mutate = isLiked ? removeFavourite : addFavourite;
    const loading = isLiked ? removeFavouriteLoading : addFavouriteLoading;

    if (loading) return;

    await mutate(
      { targetId, type: favouriteType },
      {
        onSuccess: () => {
          setIsLiked(!isLiked);
          notify.success(
            `${isLiked ? 'Xóa' : 'Thêm'} ${label} ${isLiked ? 'khỏi' : 'vào'} danh sách yêu thích thành công`
          );
          invalidateQueries(
            [queryKeys.FAVOURITE_LIST],
            [queryKeys.FAVOURITE_GET_LIST_IDS],
            [queryKeys.FAVOURITE, { targetId, type: favouriteType }]
          );
        },
        onError: (error) => {
          logger.error(
            `[${isLiked ? 'REMOVE' : 'ADD'}_FAVOURITE_ERROR]`,
            error
          );
          notify.error(
            `${isLiked ? 'Xóa' : 'Thêm'} ${label} ${isLiked ? 'khỏi' : 'vào'} danh sách yêu thích thất bại`
          );
        }
      }
    );
  };

  const handleClick = () => {
    handleVote();
  };

  const buttonContent = (
    <Button
      className={cn(
        buttonVariants({ variant }),
        {
          'text-golden-glow border-golden-glow': isLiked,
          'text-golden-glow border-golden-glow disabled:opacity-80':
            isLiked && (variant === 'person' || variant === 'popup')
        },
        className
      )}
      variant={variant === 'person' ? 'outline' : 'ghost'}
      onClick={handleClick}
    >
      <HeartIcon ref={iconRef} />
      <span
        className={cn({
          'max-520:hidden': variant === 'watch'
        })}
      >
        {text || defaultText}
      </span>
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
