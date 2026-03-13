import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

export default function CollectionListHeading({
  title,
  link
}: {
  title: string;
  link?: string;
}) {
  return (
    <div className='max-1120:mb-5 max-990:mb-4 max-480:justify-between relative mb-6 flex items-center justify-start gap-4'>
      <h3 className='max-1600:text-2xl max-640:text-xl text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        {title}
      </h3>
      {link && (
        <Link
          href={link}
          className='group hover:text-golden-glow hover:border-golden-glow flex items-center gap-0.5 rounded-full border p-1 text-lg transition-all duration-200 ease-linear hover:w-auto hover:px-2.5'
        >
          <span className='hidden text-sm group-hover:block'>Xem thêm</span>
          <FaChevronRight className='text-sm' />
        </Link>
      )}
    </div>
  );
}
