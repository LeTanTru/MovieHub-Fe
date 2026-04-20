import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type PersonLayoutProps = { children: React.ReactNode };

export default function PersonLayout({ children }: PersonLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
