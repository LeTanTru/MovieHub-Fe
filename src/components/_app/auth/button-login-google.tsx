'use client';
import { authApiRequest } from '@/apiRequests';
import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import Image from 'next/image';

export default function ButtonLoginGoogle() {
  const handleLogin = async () => {
    try {
      const response = await authApiRequest.loginGoogle({
        params: {
          loginType: 1
        }
      });
      console.log('🚀 ~ handleLogin ~ response:', response);
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  return (
    <Button variant='secondary' onClick={handleLogin} className='w-full'>
      <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
      Đăng nhập với Google
    </Button>
  );
}
