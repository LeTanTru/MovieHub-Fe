import { Footer } from '@/components/app/footer';
import { Header } from '@/components/app/header';

type TopicLayoutProps = { children: React.ReactNode };

export default function TopicLayout({ children }: TopicLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
