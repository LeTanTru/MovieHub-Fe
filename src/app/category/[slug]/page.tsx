import { categoryApiRequest } from '@/api-requests';
import CategoryList from './_components/category-list';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList();
  return categories.data.content.map((category) => ({
    slug: category.id.toString()
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = slug.split('.')[1];
  const res = await categoryApiRequest.getById({ id });

  return {
    title: res.data?.name
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = slug.split('.')[1];
  return <CategoryList id={id} />;
}
