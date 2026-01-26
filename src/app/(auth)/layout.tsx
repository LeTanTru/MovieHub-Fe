import { logo } from '@/assets';
import { ImageField } from '@/components/form';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='absolute inset-x-0 top-0 h-screen bg-[#1a1f32] bg-[url(https://rogiaitri.com/images/background.webp)] mask-[linear-gradient(#000_0%,transparent_80%)] bg-cover bg-top bg-no-repeat before:absolute before:inset-x-0 before:top-0 before:h-screen before:bg-[linear-gradient(rgba(76,102,206,0.3)0%,rgba(54,75,250,0)100%)] before:content-[""]'></div>
      <div className='relative z-2 mx-auto flex min-h-screen w-full max-w-400 flex-col justify-center'>
        <Link href='/' className='mx-auto'>
          <ImageField
            src={logo.src}
            width={80}
            height={80}
            aspect={0}
            className='mx-auto border-none bg-transparent shadow-none'
            disablePreview
            showHoverIcon={false}
          />
        </Link>
        {children}
        <div className='mt-6 text-center text-sm'>
          © Copyright {new Date().getFullYear()} by&nbsp;
          <Link href='/' className='underline'>
            Moviehub
          </Link>
        </div>
      </div>
    </>
  );
}
