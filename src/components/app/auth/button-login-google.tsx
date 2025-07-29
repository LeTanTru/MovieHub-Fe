'use client';

import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import { apiConfig } from '@/constants';
import http from '@/utils/http.util';
import Image from 'next/image';

export default function ButtonLoginGoogle() {
  const handleLogin = async () => {
    try {
    } catch (error) {}
  };

  return (
    <Button variant='secondary' onClick={handleLogin} className='w-full'>
      <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
      Đăng nhập với Google
    </Button>
  );
}
