'use client';

import './body-load.css';
import { logoWithText } from '@/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const hidePathnames = ['/auth/google/callback'];

export default function BodyLoad() {
  const pathname = usePathname();
  if (hidePathnames.includes(pathname)) return null;

  return (
    <div id='body-load'>
      <div className='bl-logo'>
        <Image
          src={logoWithText}
          priority={true}
          width={500}
          height={360}
          alt='MovieHub'
          loading='eager'
        />
        <div className='text-h1 text-center'>
          Xem Phim Miễn Phí Cực Nhanh, Chất Lượng Cao Và Cập Nhật Liên Tục
        </div>
      </div>
    </div>
  );
}
