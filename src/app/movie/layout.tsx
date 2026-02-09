import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';
import { Container } from '@/components/layout';

export default function MovieLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='max-1120:flex-col max-1600:py-28 max-1368:py-20 mx-auto flex max-w-410 gap-x-10 px-5 py-40'>
        {children}
      </Container>
      <Footer />
    </>
  );
}
