import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <>{children}</>
      <Footer />
    </>
  );
}
