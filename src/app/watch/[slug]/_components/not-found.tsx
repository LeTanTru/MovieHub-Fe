import { routeNotFound } from '@/assets';
import { Button } from '@/components/form';
import { route } from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';

export function NotFound() {
  return (
    <div className='mx-auto text-center'>
      <Image
        src={routeNotFound}
        alt='404'
        width={200}
        height={200}
        className='max-1280:size-50 max-640:size-40 mx-auto size-75'
      />
      <div className='max-1280:text-2xl max-640:text-base max-768:text-xl max-768:mb-2 mb-4 text-3xl leading-normal font-bold text-white'>
        Lỗi 404 - Không tìm thấy phim
      </div>
      <div className='text-statuary max-1280:mb-8 max-640:mb-4 max-768:mb-6 mb-12'>
        Phim bạn đang tìm kiếm không tồn tại.
        <br className='max-640:block hidden' /> Vui lòng kiểm tra đường dẫn hoặc
        quay về trang chủ.
      </div>
      <Link className='mx-auto block w-fit' href={route.home.path}>
        <Button
          className='hover:bg-golden-glow bg-golden-glow max-1280:h-10 max-640:h-8 max-768:gap-1 max-640:text-sm max-520:text-xs mx-auto flex h-12.5 items-center gap-2 rounded-full text-base font-semibold text-black'
          size='lg'
        >
          <FaChevronLeft />
          Về trang chủ
        </Button>
      </Link>
    </div>
  );
}
