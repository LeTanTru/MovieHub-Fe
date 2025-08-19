import { categoryApiRequest } from '@/api-requests';
import CategoryList from './category-list';

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList();
  return categories.data.content.map((category) => ({
    slug: category.id.toString()
  }));
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
