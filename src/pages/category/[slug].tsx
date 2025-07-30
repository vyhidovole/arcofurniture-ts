
import { useRouter } from 'next/router';
import CategoryPageContent from '@/components/CategoryPageContent';


const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const categoryStr = !slug || Array.isArray(slug) ? "all" : slug;

  return (
    <div>
      <h1>Категория: {categoryStr}</h1>
      <CategoryPageContent category={categoryStr} />
    </div>
  );
};

export default CategoryPage;
