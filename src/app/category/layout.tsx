import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

export default function CategoryLayout({
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
