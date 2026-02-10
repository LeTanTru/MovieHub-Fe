'use client';

import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import envConfig from '@/config';
import { AppConstants, storageKeys } from '@/constants';
import { logger } from '@/logger';
import {
  useLoginGoogleMutation,
  useLoginGoogleQuery,
  useProfileQuery,
  useSetCookieServerMutation
} from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { notify, setDatas } from '@/utils';
import Image from 'next/image';
import { useEffect } from 'react';

export default function ButtonLoginGoogle() {
  const setProfile = useAuthStore((s) => s.setProfile);

  const {
    refetch: getLoginGoogleUrl,
    isLoading,
    isFetching
  } = useLoginGoogleQuery({ loginType: AppConstants.loginType });
  const { refetch: getProfile } = useProfileQuery();
  const { mutateAsync: loginGoogleMutate, isPending: loginGoogleLoading } =
    useLoginGoogleMutation();

  const {
    mutateAsync: setCookieServerMutate,
    isPending: setCookieServerLoading
  } = useSetCookieServerMutation();

  const loading =
    isLoading || isFetching || loginGoogleLoading || setCookieServerLoading;

  const handleGetGoogleLoginUrl = async () => {
    try {
      const res = await getLoginGoogleUrl();

      const googleLoginUrl = res.data?.data;
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
      logger.error('Error logging in google', error);
    }
  };

  useEffect(() => {
    const handleLogin = async (code: string) => {
      try {
        const res = await loginGoogleMutate(code);
        if (res.result) {
          setDatas({
            [storageKeys.ACCESS_TOKEN]: res.access_token,
            [storageKeys.REFRESH_TOKEN]: res.refresh_token,
            [storageKeys.USER_KIND]: String(res.user_kind)
          });
          await setCookieServerMutate(res);
          notify.success('Đăng nhập thành công');
          const profile = await getProfile();
          if (profile.data?.data) {
            setProfile(profile.data?.data);
          }
          setTimeout(() => {
            window.location.href = route.home.path;
          }, 500);
        } else {
          notify.error('Đăng nhập thất bại');
        }
      } catch (error) {
        logger.error('Error during Google login:', error);
        notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
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
  }, [getProfile, loginGoogleMutate, setCookieServerMutate, setProfile]);

  return (
    <Button
      variant='secondary'
      onClick={handleGetGoogleLoginUrl}
      className='flex w-full items-center justify-center gap-2 border-none'
      disabled={loading}
      loading={loading}
    >
      <>
        <Image src={googleIcon} alt='Google Icon' width={20} height={20} />
        Đăng nhập với Google
      </>
    </Button>
  );
}
