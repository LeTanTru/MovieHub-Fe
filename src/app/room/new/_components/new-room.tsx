'use client';

import './new-room.css';
import { Button } from '@/components/form';
import { ChevronLeft, Film } from 'lucide-react';
import { MovieInfo } from './movie-info';
import { useNavigate, useIsMounted } from '@/hooks';
import NewRoomForm from './new-room-form';
import { useState } from 'react';
import { storageKeys } from '@/constants';
import { getData } from '@/utils';

export function NewRoom() {
  const navigate = useNavigate();
  const isMounted = useIsMounted();

  const [seasonId] = useState(
    () => getData(storageKeys.ROOM_CURRENT_SEASON_ID) || ''
  );
  const [movieItemId] = useState(
    () => getData(storageKeys.ROOM_MOVIE_ITEM_ID) || ''
  );

  if (!isMounted) {
    return (
      <div className='max-1600:px-5 max-640:px-4 relative mx-auto w-full max-w-300 px-12.5'>
        <div className='relative mb-4 flex min-h-11 items-center justify-start gap-4'>
          <div className='size-9 animate-pulse rounded-full border border-solid border-white/20' />
          <div className='h-7 w-48 animate-pulse rounded bg-white/10' />
        </div>
        <div className='max-1280:flex-col flex items-stretch gap-6'>
          <MovieInfo.Skeleton />
          <NewRoomForm.Skeleton />
        </div>
      </div>
    );
  }

  if (!seasonId || !movieItemId) {
    return (
      <div className='relative mx-auto w-full max-w-300 px-12.5'>
        <div className='relative mb-4 flex min-h-11 items-center justify-center gap-4'>
          <h3 className='text-2xl leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rbga(0,0,0,0.3)]'>
            Tạo phòng xem chung
          </h3>
        </div>
        <div className='bg-charade flex min-h-100 w-full flex-col items-center justify-center rounded-2xl p-8 text-center'>
          <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-white/5'>
            <Film className='text-golden-glow size-8' />
          </div>
          <h4 className='mb-2 text-lg font-medium text-white'>
            Chưa chọn phim
          </h4>
          <p className='mb-6 text-gray-400'>
            Bạn cần chọn một bộ phim và tập phim cụ thể để tạo phòng xem chung.
            <br />
            Vui lòng quay lại và chọn phim trước.
          </p>
          <Button
            variant='primary'
            className='bg-golden-glow hover:bg-golden-glow/80'
            onClick={() => navigate.push('/')}
          >
            Khám phá phim
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-1600:px-5 max-640:px-4 relative mx-auto w-full max-w-300 px-12.5'>
      <div className='relative mb-4 flex min-h-11 items-center justify-start gap-4'>
        <Button
          variant='ghost'
          className='size-9 rounded-full border border-solid border-white hover:bg-transparent hover:opacity-80'
          onClick={() => navigate.back()}
        >
          <ChevronLeft className='size-6' />
        </Button>
        <h3 className='text-2xl leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rbga(0,0,0,0.3)]'>
          Tạo phòng xem chung
        </h3>
      </div>
      <div className='max-1280:flex-col flex items-stretch gap-6'>
        {/* Left */}
        <MovieInfo />
        {/* Right */}
        <NewRoomForm />
      </div>
    </div>
  );
}
