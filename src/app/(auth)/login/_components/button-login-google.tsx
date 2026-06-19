'use client';

import { useRef } from 'react';
import { googleIcon } from '@/assets';
import { Button } from '@/components/form';
import { envConfig } from '@/config';
import { AppConstants, REDIRECT_AFTER_LOGIN_DURATION } from '@/constants';
import { logger } from '@/logger';
import { useLoginGoogleMutation, useLoginGoogleQuery } from '@/queries';
import { route } from '@/routes';
import { useAuthStore } from '@/store';
import { getSafeRedirectPath, notify } from '@/utils';
import Image from 'next/image';
import { useQueryParams } from '@/hooks';
import { useShallow } from 'zustand/shallow';

export function ButtonLoginGoogle() {
  const {
    searchParams: { redirect }
  } = useQueryParams<{ redirect?: string }>();

  const { setAccessToken, setUserKind } = useAuthStore(
    useShallow((s) => {
      return {
        setAccessToken: s.setAccessToken,
        setUserKind: s.setUserKind
      };
    })
  );

  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(
    null
  );

  const {
    refetch: getLoginGoogleUrl,
    isLoading,
    isFetching
  } = useLoginGoogleQuery({ loginType: AppConstants.loginType });
  const { mutateAsync: loginGoogleMutate, isPending: loginGoogleLoading } =
    useLoginGoogleMutation();

  const loading = isLoading || isFetching || loginGoogleLoading;

  const handleLogin = async (code: string) => {
    try {
      const res = await loginGoogleMutate(code);
      if (res.result) {
        setAccessToken(res.data?.access_token as string);
        setUserKind(res.data?.user_kind as number);

        notify.success('Đăng nhập thành công');

        setTimeout(() => {
          if (redirect) {
            window.location.href = getSafeRedirectPath(
              redirect,
              window.location.origin,
              route.home.path
            );
          } else {
            window.location.reload();
          }
        }, REDIRECT_AFTER_LOGIN_DURATION);
      } else {
        notify.error('Đăng nhập thất bại');
      }
    } catch (error) {
      logger.error('[LOGIN_GOOGLE_ERROR]', error);
      notify.error('Đăng nhập thất bại');
    }
  };

  const handleGetGoogleLoginUrl = async () => {
    try {
      // Clean up any existing listener before adding new one
      if (messageListenerRef.current) {
        window.removeEventListener('message', messageListenerRef.current);
      }

      const res = await getLoginGoogleUrl();
      const googleLoginUrl = res.data;

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
        const callbackOrigin = new URL(
          envConfig.NEXT_PUBLIC_GOOGLE_LOGIN_CALLBACK_URL
        ).origin;
        if (event.origin !== callbackOrigin) return;
        if (event.data?.code) {
          window.removeEventListener('message', onMessage);
          messageListenerRef.current = null;
          await handleLogin(event.data.code);
        }
      };

      messageListenerRef.current = onMessage;
      window.addEventListener('message', onMessage);
    } catch (error) {
      logger.error('[LOGIN_GOOGLE_ERROR]', error);
    }
  };

  return (
    <Button
      variant='secondary'
      onClick={handleGetGoogleLoginUrl}
      className='flex w-full items-center justify-center gap-2'
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
