import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type ScheduleLayoutProps = { children: React.ReactNode };

export default function ScheduleLayout({ children }: ScheduleLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
