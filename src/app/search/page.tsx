import { Search } from '@/app/search/_components';
import { Container } from '@/components/layout';
import { OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from '@/constants';
import { Metadata } from 'next';
import { envConfig } from '@/config';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{ keyword?: string }>;
}): Promise<Metadata> {
  const { keyword } = await searchParams;
  const normalizedKeyword = keyword?.trim();
  const title = normalizedKeyword
    ? `Tìm kiếm phim ${normalizedKeyword}`
    : 'Tìm kiếm phim';
  const description = normalizedKeyword
    ? `Kết quả tìm kiếm cho "${normalizedKeyword}" trên MovieHub. Khám phá các bộ phim liên quan đến ${normalizedKeyword} với đầy đủ thông tin, trailer và lịch chiếu mới nhất.`
    : 'Tìm kiếm phim theo tên, thể loại và quốc gia trên MovieHub. Hệ thống tìm kiếm thông minh giúp bạn dễ dàng tìm thấy bộ phim yêu thích của mình một cách nhanh chóng.';

  return {
    title,
    description,
    metadataBase: new URL(envConfig.NEXT_PUBLIC_URL),
    keywords: [
      normalizedKeyword || 'tìm kiếm phim',
      'phim moviehub',
      'kết quả tìm kiếm',
      'xem phim'
    ],
    robots: {
      index: false,
      follow: true
    },
    alternates: {
      canonical: '/search'
    },
    openGraph: {
      title,
      description,
      url: '/search',
      type: 'website',
      images: [
        {
          url: '/logo.webp',
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: 'MovieHub'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.webp']
    }
  };
}

export default async function SearchPage() {
  return (
    <Container className='max-1600:py-28 max-1360:pt-25 max-990:pb-24 max-640:pb-20 relative min-h-[calc(100dvh-400px)] py-40'>
      <div className='max-640:gap-8 flex flex-col gap-12.5'>
        <Search />
      </div>
    </Container>
  );
}
