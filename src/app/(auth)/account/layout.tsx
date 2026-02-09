import { Header } from '@/app/(auth)/account/_components';
import { Footer } from '@/components/app/footer';
import { Container } from '@/components/layout';
import type { ReactNode } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
