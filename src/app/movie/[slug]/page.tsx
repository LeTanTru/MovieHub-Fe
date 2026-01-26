import { movieApiRequest } from '@/api-requests';
import { getMovieDetail } from '@/app/movie/[slug]/_components/movie-detail';
import MovieDetail from '@/app/movie/[slug]/movie-detail';
import envConfig from '@/config';
import { AppConstants } from '@/constants';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateStaticParams() {
  const movies = await movieApiRequest.getList();
  return movies.data.content.map((movie) => ({
    slug: `${movie.slug}.${movie.id.toString()}`
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('.')[1];

  const res = await getMovieDetail(id);
  const previousImages = (await parent).openGraph?.images || [];
  const images = res.data?.posterUrl
    ? [`${AppConstants.contentRootUrl}${res.data.posterUrl}`, ...previousImages]
    : previousImages;

  return {
    title: `Thông tin chi tiết phim ${res.data?.title} - ${res.data?.originalTitle}`,
    description: res.data?.description,
    openGraph: {
      title: `Thông tin chi tiết phim ${res.data?.title} - ${res.data?.originalTitle}`,
      description: res.data?.description,
      images
    },
    twitter: {
      card: 'summary_large_image',
      title: `Thông tin chi tiết phim ${res.data?.title} - ${res.data?.originalTitle}`,
      description: res.data?.description,
      images
    },
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_URL}/movie/${slug}`
    }
  };
}

export default async function MovieDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MovieDetail slug={slug} />;
}
