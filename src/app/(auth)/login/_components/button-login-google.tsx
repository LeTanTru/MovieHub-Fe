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
import { getData, notify, removeData, setMultipleData } from '@/utils';
import Image from 'next/image';

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

  const handleLogin = async (code: string) => {
    try {
      const res = await loginGoogleMutate(code);
      if (res.result) {
        setMultipleData({
          [storageKeys.ACCESS_TOKEN]: res.access_token,
          [storageKeys.REFRESH_TOKEN]: res.refresh_token
        });
        await setCookieServerMutate(res);
        notify.success('Đăng nhập thành công');
        const profile = await getProfile();
        const profileData = profile.data?.data;

        if (profileData) {
          setProfile(profileData);
        }

        setTimeout(() => {
          const redirectPath = getData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
          removeData(storageKeys.REDIRECT_PATH_AFTER_LOGIN);
          window.location.href = redirectPath || route.home.path;
        }, 500);
      } else {
        notify.error('Đăng nhập thất bại');
      }
    } catch (error) {
      logger.error('Error during Google login:', error);
      notify.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  const handleGetGoogleLoginUrl = async () => {
    try {
      const res = await getLoginGoogleUrl();
      const googleLoginUrl = res.data?.data;

      const width = 500;
      const height = 600;
      const dualScreenLeft = window.screenLeft ?? window.screenX;
      const dualScreenTop = window.screenTop ?? window.screenY;
      const left = window.innerWidth / 2 - width / 2 + dualScreenLeft;
      const top = window.innerHeight / 2 - height / 2 + dualScreenTop;

      window.open(
        googleLoginUrl,
        'GoogleLoginPopup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no`
      );

      const onMessage = async (event: MessageEvent) => {
        if (event.origin !== envConfig.NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL)
          return;
        if (event.data?.code) {
          window.removeEventListener('message', onMessage);
          await handleLogin(event.data.code);
        }
      };

      window.addEventListener('message', onMessage);
    } catch (error) {
      logger.error('Error logging in google', error);
    }
  };

  return (
    <Button
      variant='secondary'
      onClick={handleGetGoogleLoginUrl}
      className='flex w-full items-center justify-center gap-2 dark:border-none'
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
