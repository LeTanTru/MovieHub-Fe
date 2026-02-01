'use client';

import { MessageIcon } from '@/assets/icons';
import { ButtonWatchNow } from '@/components/app/button-watch-now';
import { Button, ToolTip } from '@/components/form';
import { route } from '@/routes';
import { MovieResType } from '@/types';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaHeart, FaPlus } from 'react-icons/fa6';

export default function MovieActorBar({ movie }: { movie: MovieResType }) {
  return (
    <div className='relative z-3 p-7.5'>
      <div className='flex items-center justify-between gap-8'>
        <ButtonWatchNow
          className='text-watch-now inline-flex min-h-15 shrink-0 items-center justify-center gap-4 rounded-4xl bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] px-8! py-4! text-base font-semibold opacity-100 shadow-[0_5px_10px_5px_rgba(255,218,125,.1)] transition-all duration-200 ease-linear hover:opacity-90 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,.15)]'
          href={`${route.watch.path}/${movie?.slug}.${movie?.id}`}
        />
        {/* Left */}
        <div className='flex grow justify-start gap-4'>
          <ToolTip
            className='bg-white text-center text-black [&>span>svg]:w-4 [&>span>svg]:fill-white'
            title='Thêm vào danh sách yêu thích để nhận thông báo cập nhật về phi nhé !'
            side='top'
          >
            <Button
              className='group h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
              variant='ghost'
            >
              <FaHeart className='group-hover:text-light-golden-yellow transition-all duration-200 ease-linear' />
              Yêu thích
            </Button>
          </ToolTip>
          <Button
            className='group h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
            variant='ghost'
          >
            <FaPlus className='group-hover:text-light-golden-yellow transition-all duration-200 ease-linear' />
            Thêm vào
          </Button>
          <Button
            className='group h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
            variant='ghost'
          >
            <FaTelegramPlane className='group-hover:text-light-golden-yellow transition-all duration-200 ease-linear' />
            Chia sẻ
          </Button>
          <Button
            className='group h-fit min-w-20! flex-col px-2! text-xs hover:bg-white/10'
            variant='ghost'
          >
            <MessageIcon className='group-hover:text-light-golden-yellow transition-all duration-200 ease-linear' />
            Bình luận
          </Button>
        </div>
        {/* Right */}
        <div className='relative flex flex-col items-end gap-2 text-white'>
          <div className='bg-review-background flex cursor-pointer items-center rounded-[48px] px-2.5 py-2 transition-all duration-200 ease-linear hover:opacity-80'>
            <div className='h-6 w-6 bg-[url(/logo.png)] bg-cover bg-position-[50%]'></div>
            <span className='mr-2 ml-1 text-base font-bold'>
              {movie.averageRating}
            </span>
            <span className='text-xs underline'>Đánh giá</span>
          </div>
        </div>
      </div>
    </div>
  );
}
