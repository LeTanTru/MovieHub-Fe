'use client';

import { logoWithText } from '@/assets';
import './body-load.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const hidePathnames = ['/auth/google/callback'];

export default function BodyLoad() {
  const pathname = usePathname();
  if (hidePathnames.includes(pathname)) return null;

  return (
    <div id='body-load'>
      <div className='bl-logo'>
        <Image src={logoWithText} width={500} height={360} alt='RoPhim' />
        <div className='text-h1 text-center'>
          Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
        </div>
      </div>
    </div>
  );
}
