import { categoryApiRequest } from '@/api-requests';
import CategoryList from './_components/category-list';

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
  const id = slug.split('.')[1];
  return <CategoryList id={id} />;
}
