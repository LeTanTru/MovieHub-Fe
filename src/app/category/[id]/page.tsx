import { categoryApiRequest } from '@/api-requests';
import CategoryList from './category-list';

export async function generateStaticParams() {
  const categories = await categoryApiRequest.getList();
  return categories.data.content;
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <CategoryList id={id} />
    </>
  );
}
