import { Header } from '@/components/app/header';
import { Sidebar } from '@/app/user/_components';
import { Container } from '@/components/layout';
import { Footer } from '@/components/app/footer';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='max-1120:flex-col max-1600:py-28 max-1368:py-20 mx-auto flex max-w-410 gap-x-10 px-5 py-40'>
        <Sidebar />
        {children}
      </Container>
      <Footer />
    </>
  );
}
