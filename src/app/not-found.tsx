import { image404 } from '@/assets';
import Header from '@/components/app/header';
import { Button } from '@/components/form';
import { Container } from '@/components/layout';
import route from '@/routes';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';

export default function NotFound() {
  return (
    <div>
      <Header />
      <Container className='min-h-[calc(100vh_-_400px)] pt-40 pb-40'>
        <div className='mx-auto my-24 w-full max-w-200 px-0 py-7.5 text-center'>
          <div className='mb-8 grayscale-[1]'>
            <Image
              src={image404.src}
              alt='404'
              width={200}
              height={200}
              className='mx-auto h-auto w-full max-w-75 opacity-30'
            />
          </div>
          <div className='mb-4 text-3xl leading-[1.5] font-bold text-white'>
            Lỗi 404 - Không tìm thấy trang
          </div>
          <div className='text-statuary mb-12 text-sm'>
            Trang bạn đang tìm kiếm không tồn tại. Vui lòng kiểm tra đường dẫn
            hoặc quay về trang chủ.
          </div>
          <Button
            className='hover:bg-light-golden-yellow bg-light-golden-yellow text-md mx-auto flex min-h-12.5 items-center gap-x-2 rounded-4xl font-semibold text-black'
            size={'lg'}
          >
            <FaChevronLeft />
            <Link className='block w-full' href={route.home}>
              Về trang chủ
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
