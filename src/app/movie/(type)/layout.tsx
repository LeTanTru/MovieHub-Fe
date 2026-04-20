import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';
import type { ReactNode } from 'react';

type MovieByTypeLayoutProps = { children: ReactNode };

export default function MovieByTypeLayout({
  children
}: MovieByTypeLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
