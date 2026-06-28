'use client';

import { Button } from '@/components/form';
import { cn } from '@/lib';
import { notify, setData } from '@/utils';
import { Podcast } from 'lucide-react';
import { route } from '@/routes';
import { storageKeys } from '@/constants';
import {
  useAuth,
  useIsMounted,
  useMovieInfo,
  useNavigate,
  useQueryParams
} from '@/hooks';

type ButtonRoomProps = {
  className?: string;
};

export function ButtonRoom({ className }: ButtonRoomProps) {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { currentSeason, isSingle, isSeries } = useMovieInfo();
  const isMounted = useIsMounted();

  const {
    searchParams: { episode }
  } = useQueryParams<{ season?: string; episode?: string }>();

  const handleClick = () => {
    let movieItemId: string = '';

    if (!currentSeason) {
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      return;
    }

    if (isSingle) movieItemId = currentSeason?.id;
    if (isSeries)
      movieItemId =
        currentSeason?.episodes?.find((ep) => ep.label === episode)?.id || '';

    if (!movieItemId) {
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau.');
      return;
    }

    setData(storageKeys.ROOM_CURRENT_SEASON_ID, currentSeason.id);
    setData(storageKeys.ROOM_MOVIE_ITEM_ID, movieItemId);
    navigate.push(route.room.new.path);
  };

  if (!isMounted || !isAuthenticated) return null;

  return (
    <Button
      variant='ghost'
      className={cn(
        'hover:text-golden-glow flex h-10! items-center justify-center gap-2 px-4 py-2.5 whitespace-nowrap transition-all duration-200 ease-linear hover:bg-white/10',
        className
      )}
      onClick={handleClick}
    >
      <Podcast className='size-5' />
      <span className='max-640:sr-only'>Xem chung</span>
    </Button>
  );
}
