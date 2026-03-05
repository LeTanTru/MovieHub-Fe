import { route } from '@/routes';
import { CollectionResType } from '@/types';
import { generateSlug, getColorList } from '@/utils';
import { cn } from '@/lib';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa6';

export default function TopicItem({
  topic,
  isSwitched
}: {
  topic: CollectionResType;
  isSwitched: boolean;
}) {
  const colors = getColorList(topic.color || '[]');

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.slice(0, 2).join(', ')})`
  };

  const linkClassName = cn(
    'topic-item relative top-0 overflow-hidden transition-all duration-200 ease-linear hover:-translate-y-2 max-480:w-35 max-480:shrink-0',
    {
      'topic bg-background/50 group rounded-md pt-5 pr-10 pb-5 pl-6 max-1280:p-5':
        isSwitched,
      'bg-main-background/50 flex rounded-tl-[20px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[40px] px-6 py-5 after:absolute after:inset-0 after:z-3 after:rounded-tl-[64px] after:rounded-tr-[40px] after:rounded-br-[64px] after:rounded-bl-[40px] after:shadow-[inset_0_-10px_20px_0_#fff2] after:content-[""] max-1280:p-4':
        !isSwitched
    }
  );

  const gradientDivClassName = cn('absolute top-0 right-0 bottom-0 left-0', {
    mask: isSwitched
  });

  const contentDivClassName = cn(
    'relative z-3 flex h-full min-h-27.5 max-1900:min-h-27.5 max-1280:min-h-25 max-800:min-h-20 w-full shrink-0 flex-col items-start justify-end gap-3 max-640:justify-center',
    {
      'max-640:min-h-12.5': isSwitched
    }
  );

  const titleClassName = cn(
    'max-1536:text-[24px] max-1120:text-xl max-640:text-lg max-800:font-medium leading-[1.3] font-bold text-white',
    {
      'text-[28px] transition-all duration-200 ease-linear text-shadow-[0_1px_0_#eee] group-hover:opacity-80':
        isSwitched,
      'text-2xl max-480:text-base': !isSwitched
    }
  );

  const actionClassName = cn(
    'flex min-h-7.5 items-center justify-center max-640:hidden',
    {
      'gap-x-2 font-medium transition-all duration-200 ease-linear group-hover:opacity-80':
        isSwitched,
      'gap-x-1 text-sm': !isSwitched
    }
  );

  return (
    <Link
      href={`${route.topic.path}/${generateSlug(topic.name)}.${topic.id}`}
      className={linkClassName}
    >
      <div className={gradientDivClassName} style={gradientStyle}></div>
      <div className={contentDivClassName}>
        <h3 className={titleClassName}>{topic.name}</h3>
        <div className={actionClassName}>
          <span className={isSwitched ? '' : 'font-medium'}>Xem toàn bộ</span>
          <FaAngleRight strokeWidth={isSwitched ? undefined : 4} />
        </div>
      </div>
    </Link>
  );
}
