import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type CategoryLayoutProps = { children: React.ReactNode };

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
