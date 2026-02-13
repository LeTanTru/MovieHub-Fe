import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';
import { Container } from '@/components/layout';

export default function WatchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='max-1919:px-5 max-1600:pt-28 max-1360:pt-20 max-990:pb-24 max-800:pt-8 min-h-[calc(100vh-400px)] px-12.5 pt-40 pb-40 max-sm:px-4'>
        {children}
      </Container>
      <Footer />
    </>
  );
}
