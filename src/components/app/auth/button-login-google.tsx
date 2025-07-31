'use client';
import { accountApiRequest, authApiRequest } from '@/apiRequests';
import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useProfileStore } from '@/store';
import useDialogStore from '@/store/use-auth-store';
import { notify, setAccessTokenToLocalStorage, setData } from '@/utils';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ButtonLoginGoogle() {
  const { setOpen, setMode } = useDialogStore();
  const { setProfile } = useProfileStore();

  const handleGetGoogleLoginUrl = async () => {
    try {
      const response = await authApiRequest.getGoogleLoginUrl({
        params: {
          loginType: 1
        }
      });

      const googleLoginUrl = response.data as string;
      const width = 500;
      const height = 600;

      const dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      const dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screenY;

      const screenWidth = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth;
      const screenHeight = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight;

      const left = screenWidth / 2 - width / 2 + dualScreenLeft;
      const top = screenHeight / 2 - height / 2 + dualScreenTop;

      window.open(
        googleLoginUrl,
        'GoogleLoginPopup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`
      );
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  };

  const handleLogin = async (code: string) => {
    try {
      const response = await authApiRequest.loginGoogle(code);

      setAccessTokenToLocalStorage(response.data?.access_token!);
      setData(storageKeys.USER_KIND, String(response.data?.user_kind!));

      const profileRes = await accountApiRequest.getProfile();
      const profile = profileRes.data;
      setProfile(profile!);
      setOpen(false);
      setMode('login');
      notify.success('Đăng nhập thành công');
    } catch (error) {
      logger.error('Error during Google login:', error);
      notify.error('Đăng nhập thất bại');
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3636') return;
      if (event.data?.code) {
        await handleLogin(event.data.code);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Button
      variant='secondary'
      onClick={handleGetGoogleLoginUrl}
      className='w-full'
    >
      <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
      Đăng nhập với Google
    </Button>
  );
}
