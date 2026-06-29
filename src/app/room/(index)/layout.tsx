import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';

type RoomLayoutProps = { children: React.ReactNode };

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
