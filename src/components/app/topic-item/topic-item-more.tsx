import { route } from '@/routes';
import { cn } from '@/lib';
import Link from 'next/link';

export default function TopicItemMore({
  moreCount,
  isSwitched
}: {
  moreCount: number;
  isSwitched: boolean;
}) {
  const linkClassName = cn(
    'relative top-0 overflow-hidden transition-all duration-200 ease-linear hover:-translate-y-2 max-480:w-35 max-480:shrink-0',
    {
      'topic bg-background/50 group rounded-md pt-5 pr-10 pb-5 pl-6 max-1280:p-5':
        isSwitched,
      'bg-main-background/50 flex rounded-tl-[20px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[40px] px-6 py-5 after:absolute after:inset-0 after:z-3 after:rounded-tl-[64px] after:rounded-tr-[40px] after:rounded-br-[64px] after:rounded-bl-[40px] after:shadow-[inset_0_-10px_20px_0_#fff2] after:content-[""] max-1280:p-4':
        !isSwitched
    }
  );

  const titleClassName = cn(
    'max-1536:text-[24px] max-1120:text-xl max-1120:font-semibold max-800:font-medium max-640:text-lg leading-[1.3] font-bold text-white',
    {
      'block truncate text-[28px] transition-all duration-200 ease-linear text-shadow-[0_1px_0_#eee] group-hover:opacity-80':
        isSwitched,
      'text-2xl max-480:text-base': !isSwitched
    }
  );

  return (
    <Link href={route.topic.path} className={linkClassName}>
      <div className='mask absolute top-0 right-0 bottom-0 left-0 bg-linear-to-b from-red-500 to-blue-500'></div>
      <div className='max-1900:min-h-27.5 max-1280:min-h-25 max-800:min-h-20 max-640:min-h-12.5 relative z-3 flex h-full min-h-27.5 w-full shrink-0 items-center justify-center'>
        <h3 className={titleClassName}>+{moreCount} chủ đề</h3>
      </div>
    </Link>
  );
}
