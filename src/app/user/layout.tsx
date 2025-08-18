import Header from '@/components/app/header';
import { Sidebar } from '@/components/app/user';
import { Container } from '@/components/layout';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='mx-auto flex max-w-410 gap-x-10 px-5 pt-40 max-[1600px]:pt-28 max-[1368px]:pt-20 max-[1120px]:flex-col'>
        <Sidebar />
        {children}
      </Container>
    </>
  );
}
