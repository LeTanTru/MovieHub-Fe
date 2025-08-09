import Header from '@/components/app/header';
import { Sidebar } from '@/components/app/user';
import { Container } from '@/components/layout';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Container className='flex gap-x-20 pt-40'>
        <Sidebar />
        {children}
      </Container>
    </>
  );
}
