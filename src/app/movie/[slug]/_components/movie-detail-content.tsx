import { Button } from '@/components/form';
import { route } from '@/routes';
import { MovieResType } from '@/types';
import Link from 'next/link';
import { FaPlay } from 'react-icons/fa6';

export default function MovieDetailContent({ movie }: { movie: MovieResType }) {
  return (
    <div className='bg-main-background/60 flex grow flex-col rounded-tl-[48px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] backdrop-blur-[20px]'>
      <div className='p-7.5'>
        <div className='flex items-center justify-between gap-8'>
          <Link href={`${route.watch.path}/${movie?.slug}.${movie?.id}`}>
            <Button className='inline-flex min-h-15 shrink-0 items-center justify-center gap-4 rounded-4xl bg-[linear-gradient(39deg,rgba(254,207,89,1),rgba(255,241,204,1))] px-8! py-4! text-lg font-normal text-[#191B24] opacity-100 shadow-[0_5px_10px_5px_rgba(255,218,125,.1)] transition-all duration-200 ease-linear hover:opacity-90 hover:shadow-[0_5px_10px_10px_rgba(255,218,125,.15)]'>
              <FaPlay />
              Xem ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
