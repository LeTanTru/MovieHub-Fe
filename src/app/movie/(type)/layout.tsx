import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';
import type { ReactNode } from 'react';

export default function MovieByTypeLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
