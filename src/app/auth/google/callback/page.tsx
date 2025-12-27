'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import envConfig from '@/config';

export default function GoogleCallback() {
  const router = useRouter();
  const callbackUrl = envConfig.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ code }, callbackUrl);

      window.close();
    } else {
      router.push('/');
    }
  }, [router]);

  return <div className='bg-accent'></div>;
}
