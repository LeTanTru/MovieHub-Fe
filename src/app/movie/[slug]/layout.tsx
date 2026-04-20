import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type MovieLayoutProps = { children: React.ReactNode };

export default function MovieLayout({ children }: MovieLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
