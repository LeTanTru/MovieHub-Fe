import './topic.css';
import { route } from '@/routes';
import Link from 'next/link';

export default function TopicItemMoreV2({ moreCount }: { moreCount: number }) {
  return (
    <Link
      href={route.topic.path}
      className='bg-main-background/50 relative top-0 flex overflow-hidden rounded-tl-[20px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[40px] px-6 py-5 transition-all duration-200 ease-linear after:absolute after:inset-0 after:z-3 after:rounded-tl-[64px] after:rounded-tr-[40px] after:rounded-br-[64px] after:rounded-bl-[40px] after:shadow-[inset_0_-10px_20px_0_#fff2] after:content-[""] hover:-translate-y-2'
    >
      <div className='mask absolute top-0 right-0 bottom-0 left-0 bg-linear-to-b from-red-500 to-blue-500'></div>
      <div className='relative z-3 flex h-full min-h-27.5 w-full shrink-0 items-center justify-center'>
        <h3 className='line-clamp-2 text-2xl leading-[1.3] font-bold text-white'>
          +{moreCount} chủ đề
        </h3>
      </div>
    </Link>
  );
}
