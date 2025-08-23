import Header from '@/components/app/header';
import { Container } from '@/components/layout';

export default function PersonLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='min-h-[calc(100vh_-_400px)] px-5 pt-40 pb-40 max-[1600px]:pt-28 max-[1360px]:pt-20 max-[990px]:pb-24 max-[800px]:pt-8 max-[640px]:px-4'>
        {children}
      </Container>
    </>
  );
}
