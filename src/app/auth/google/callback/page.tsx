// GoogleCallback.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code && window.opener) {
      window.opener.postMessage({ code }, 'http://localhost:3636');

      window.close();
    } else {
      router.push('/');
    }
  }, [router]);

  return <p>Đang xử lý đăng nhập Google...</p>;
}
