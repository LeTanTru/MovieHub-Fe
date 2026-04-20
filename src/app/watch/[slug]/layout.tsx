import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type WatchLayoutProps = { children: React.ReactNode };

export default function WatchLayout({ children }: WatchLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
