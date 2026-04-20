import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type CountryLayoutProps = { children: React.ReactNode };

export default function CountryLayout({ children }: CountryLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
