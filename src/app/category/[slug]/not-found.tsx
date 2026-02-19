import { routeNotFound } from '@/assets';
import { Button } from '@/components/form';
import { route } from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';

export default function NotFound() {
  return (
    <>
      <div className='min-h-[calc(100vh-400px)] pt-20 pb-20'>
        <div className='mx-auto my-24 w-full max-w-200 px-0 py-7.5 text-center'>
          <div className='mb-8'>
            <Image
              src={routeNotFound}
              alt='404'
              width={200}
              height={200}
              className='mx-auto h-auto w-full max-w-75'
            />
          </div>
          <div className='mb-4 text-3xl leading-normal font-bold text-white'>
            Lỗi 404 - Không tìm thấy danh mục này
          </div>
          <div className='text-statuary mb-12 text-sm'>
            Danh mục phim bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra
            đường dẫn hoặc quay về trang chủ.
          </div>
          <Link className='block w-full' href={route.home.path}>
            <Button
              className='hover:bg-light-golden-yellow bg-light-golden-yellow mx-auto flex min-h-12.5 items-center gap-x-2 rounded-4xl text-base font-semibold text-black'
              size='lg'
            >
              <FaChevronLeft />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
