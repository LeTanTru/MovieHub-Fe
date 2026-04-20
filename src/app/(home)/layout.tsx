import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type HomeLayoutProps = { children: React.ReactNode };

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
