import Header from '@/components/app/header';
import { Sidebar } from '@/app/user/_components';
import { Container } from '@/components/layout';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='max-1120:flex-col max-1600:pt-28 max-1368:pt-20 mx-auto flex max-w-410 gap-x-10 px-5 pt-40'>
        <Sidebar />
        {children}
      </Container>
    </>
  );
}
