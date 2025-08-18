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
      <Container className='mx-auto min-h-[100vh_-_400px] max-w-[1900px] px-12.5 pt-40 pb-40'>
        {children}
      </Container>
    </>
  );
}
