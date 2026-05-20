import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xác thực Google | MovieHub',
  robots: {
    index: false,
    follow: false
  }
};

type GoogleCallbackLayoutProps = { children: React.ReactNode };

export default function GoogleCallbackLayout({
  children
}: GoogleCallbackLayoutProps) {
  return <>{children}</>;
}
