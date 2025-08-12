'use client';

import { logoWithText } from '@/assets';
import './body-load.css';
import Image from 'next/image';

export default function BodyLoad() {
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
