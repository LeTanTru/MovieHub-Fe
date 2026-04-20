import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type SearchLayoutProps = { children: React.ReactNode };

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
