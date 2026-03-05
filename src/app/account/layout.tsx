import { Header } from '@/app/account/_components';
import { Container } from '@/components/layout';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='bg-dark-space absolute inset-0 top-0 h-screen bg-[url(/auth-background.webp)] mask-[linear-gradient(#000_0%,transparent_80%)] bg-cover bg-top bg-no-repeat before:absolute before:inset-0 before:top-0 before:h-screen before:bg-[linear-gradient(rgba(76,102,206,0.3)_0%,rgba(54,75,250,0)_100%)] before:content-[""]'></div>
      <Header />

      <Container className='max-1536:min-h-[calc(100vh-72px)] max-520:min-h-[calc(100vh-64px)] relative z-2 mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-400 flex-col justify-center'>
        {children}
        <div className='mt-4 text-center text-sm'>
          © Copyright {new Date().getFullYear()} by&nbsp;
          <Link href='/' className='underline'>
            Moviehub
          </Link>
        </div>
      </Container>
    </>
  );
}
