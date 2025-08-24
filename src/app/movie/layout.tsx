import Header from '@/components/app/header';

export default function MovieLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
