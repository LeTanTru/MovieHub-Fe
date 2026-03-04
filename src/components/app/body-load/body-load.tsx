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
          unoptimized
        />
        <div className='max-1280:text-3xl max-1024:text-2xl max-768:text-xl max-480:text-lg text-center text-[32px] text-white/30'>
          Xem Phim Miễn Phí Cực Nhanh, <br /> Chất Lượng Cao Và Cập Nhật Liên
          Tục
        </div>
      </div>
    </div>
  );
}
