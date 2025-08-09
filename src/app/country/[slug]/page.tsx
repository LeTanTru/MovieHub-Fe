export default async function CountryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <div>{slug}</div>;
}
