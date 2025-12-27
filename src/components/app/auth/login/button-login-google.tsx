'use client';

import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import envConfig from '@/config';
import { AppConstants, storageKeys } from '@/constants';
import { logger } from '@/logger';
import { useLoginGoogleMutation, useLoginGoogleQuery } from '@/queries';
import { useAuthDialogStore, useAuthStore } from '@/store';
import { notify, setAccessTokenToLocalStorage, setData } from '@/utils';
import { LucideLoader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ButtonLoginGoogle() {
  const authDialogStore = useAuthDialogStore();
  const authStore = useAuthStore();
  const loginGoogleQuery = useLoginGoogleQuery(AppConstants.loginType);
  const loginGoogleMutation = useLoginGoogleMutation();

  const loading = loginGoogleQuery.isFetching || loginGoogleMutation.isPending;

  const handleGetGoogleLoginUrl = async () => {
    try {
      const response = await loginGoogleQuery.refetch();

      const googleLoginUrl = response.data?.data;
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
        const response = await loginGoogleMutation.mutateAsync(code);

        setAccessTokenToLocalStorage(response.data?.access_token!);
        setData(storageKeys.USER_KIND, String(response.data?.user_kind!));

        authDialogStore.setOpen(false);
        setTimeout(() => {
          authStore.setAuthenticated(true);
        }, 100);
        notify.success('Đăng nhập thành công');
      } catch (error) {
        logger.error('Error during Google login:', error);
        notify.error('Đăng nhập thất bại');
      }
    };

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== envConfig.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK)
        return;
      if (event.data?.code) {
        await handleLogin(event.data.code);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [
    loginGoogleMutation,
    authStore.setAuthenticated,
    authDialogStore.setOpen,
    authDialogStore,
    authStore
  ]);

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
          strokeWidth={3}
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
