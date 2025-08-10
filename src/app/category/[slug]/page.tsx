import { categoryApiRequest } from '@/api-requests';
import CategoryList from './category-list';
import Header from '@/components/app/header';

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList();
  return categories.data.content;
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <CategoryList slug={slug} />
    </>
  );
}
