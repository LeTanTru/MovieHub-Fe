import { countryOptions } from '@/constants';
import CountryList from './_components/country-list';
import { Metadata } from 'next';
import { generateSlug } from '@/utils';

export async function generateStaticParams() {
  return countryOptions.slice(0, 20).map((country) => ({
    slug: `${generateSlug(country.label)}.${country.value}`
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const countryCode = slug.split('.')[1];
  const countryName = countryOptions.find(
    (country) => country.value === countryCode
  )?.label;

  return {
    title: `Phim ${countryName}`
  };
}

export default async function CountryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const countryCode = slug.split('.')[1];
  return <CountryList countryCode={countryCode} />;
}
