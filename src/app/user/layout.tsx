import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
