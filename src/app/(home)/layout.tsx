import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';
import { Container } from '@/components/layout';

export default function HomeLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}
