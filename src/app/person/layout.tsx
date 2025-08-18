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
      <Container className='mx-auto min-h-[100vh_-_400px] max-w-[1900px] px-12.5 pt-40 pb-40 max-[1919px]:px-5 max-[1600px]:pt-28 max-[1360px]:pt-20 max-[990px]:pb-24 max-[800px]:pt-8'>
        {children}
      </Container>
    </>
  );
}
