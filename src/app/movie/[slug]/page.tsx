import MovieDetail from '@/app/movie/[slug]/movie-detail';

export default async function MovieDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <MovieDetail slug={slug} />;
}
