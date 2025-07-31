'use client';
import { accountApiRequest, authApiRequest } from '@/apiRequests';
import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import { storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useProfileStore } from '@/store';
import useDialogStore from '@/store/use-auth-store';
import { notify, setAccessTokenToLocalStorage, setData } from '@/utils';
import { LucideLoader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ButtonLoginGoogle() {
  const { setOpen, setMode } = useDialogStore();
  const { setProfile } = useProfileStore();
  const [loading, setLoading] = useState(false);

  const handleGetGoogleLoginUrl = async () => {
    try {
      const response = await authApiRequest.getGoogleLoginUrl({
        params: { loginType: 1 }
      });

      const googleLoginUrl = response.data;
      const width = 500;
      const height = 600;

      const dualScreenLeft =
        window.screenLeft !== undefined ? window.screenLeft : window.screenX;
      const dualScreenTop =
        window.screenTop !== undefined ? window.screenTop : window.screenY;

      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const screenHeight =
        window.innerHeight || document.documentElement.clientHeight;

      const left = screenWidth / 2 - width / 2 + dualScreenLeft;
      const top = screenHeight / 2 - height / 2 + dualScreenTop;

      window.open(
        googleLoginUrl,
        'GoogleLoginPopup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`
      );
    } catch (error) {
      logger.error('Error logging in with Google:', error);
    }
  };

  useEffect(() => {
    const handleLogin = async (code: string) => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:3636') return;
      if (event.data?.code) {
        await handleLogin(event.data.code);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setOpen, setMode, setProfile]);

  return (
    <Button
      variant='secondary'
      onClick={handleGetGoogleLoginUrl}
      className='flex w-full items-center justify-center gap-2'
      disabled={loading}
    >
      {loading ? (
        <LucideLoader2
          className='text-muted-foreground h-6! w-6! animate-spin'
          strokeWidth={2}
        />
      ) : (
        <>
          <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
          Đăng nhập với Google
        </>
      )}
    </Button>
  );
}
