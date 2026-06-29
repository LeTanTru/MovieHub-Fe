import { Header } from '@/components/app/header';

type RoomLayoutProps = { children: React.ReactNode };

export default function RoomLayout({ children }: RoomLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
