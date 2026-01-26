'use client';

import { useEffect } from 'react';
import envConfig from '@/config';
import { CircleLoading } from '@/components/loading';
import { useNavigate } from '@/hooks';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const callbackUrl = envConfig.NEXT_PUBLIC_API_GOOGLE_LOGIN_CALLBACK;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ code }, callbackUrl);

      window.close();
    } else {
      navigate('/');
    }
  }, [callbackUrl, navigate]);

  return (
    <div className='bg-accent flex h-screen items-center justify-center'>
      <CircleLoading className='size-10' />
    </div>
  );
}
