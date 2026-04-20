import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

type UserLayoutProps = { children: React.ReactNode };

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
