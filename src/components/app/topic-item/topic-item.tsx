import { route } from '@/routes';
import { CollectionResType } from '@/types';
import { generateSlug } from '@/utils';
import Link from 'next/link';
import { FaAngleRight } from 'react-icons/fa6';

export default function TopicItem({
  topic,
  random
}: {
  topic: CollectionResType;
  random: boolean;
}) {
  const colors = JSON.parse(topic.color || '[]');

  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors.slice(0, 2).join(', ')})`
  };

  const linkClassName = random
    ? 'topic bg-background/50 group relative top-0 justify-between overflow-hidden rounded-md pt-5 pr-10 pb-5 pl-6 transition-all duration-200 ease-linear hover:-translate-y-2'
    : 'bg-main-background/50 relative top-0 flex overflow-hidden rounded-tl-[20px] rounded-tr-[40px] rounded-br-[20px] rounded-bl-[40px] px-6 py-5 transition-all duration-200 ease-linear after:absolute after:inset-0 after:z-3 after:rounded-tl-[64px] after:rounded-tr-[40px] after:rounded-br-[64px] after:rounded-bl-[40px] after:shadow-[inset_0_-10px_20px_0_#fff2] after:content-[""] hover:-translate-y-2';

  const gradientDivClassName = random
    ? 'mask absolute top-0 right-0 bottom-0 left-0'
    : 'absolute top-0 right-0 bottom-0 left-0';

  const contentDivClassName = random
    ? 'relative z-3 flex h-full min-h-27.5 w-full shrink-0 flex-col items-start justify-end gap-3 p-0'
    : 'relative z-3 flex h-full min-h-27.5 w-full shrink-0 flex-col items-start justify-end gap-3';

  const titleClassName = random
    ? 'line-clamp-2 block truncate text-[28px] leading-[1.3] font-bold text-white transition-all duration-200 ease-linear text-shadow-[0_1px_0_#eee] group-hover:opacity-80'
    : 'line-clamp-2 text-2xl leading-[1.3] font-bold text-white';

  const actionClassName = random
    ? 'flex min-h-7.5 items-center justify-center gap-x-2 font-medium transition-all duration-200 ease-linear group-hover:opacity-80'
    : 'flex min-h-7.5 items-center justify-center gap-x-1 text-sm';

  return (
    <Link
      href={`${route.topic.path}/${generateSlug(topic.name)}.${topic.id}`}
      className={linkClassName}
    >
      <div className={gradientDivClassName} style={gradientStyle}></div>
      <div className={contentDivClassName}>
        <h3 className={titleClassName}>{topic.name}</h3>
        <div className={actionClassName}>
          <span className={random ? '' : 'font-medium'}>Xem toàn bộ</span>
          <FaAngleRight strokeWidth={random ? undefined : 4} />
        </div>
      </div>
    </Link>
  );
}
