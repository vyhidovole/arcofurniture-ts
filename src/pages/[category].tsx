
import { useRouter } from 'next/router';
import CategoryPageContent from '@/components/CategoryPageContent';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
 const categoryStr = !category || Array.isArray(category) ? "catalogueproducts" : category;
 

  return (
    <div>
      <h1>Категория: {category}</h1>
      <CategoryPageContent category={categoryStr} />
    </div>
  );
};

export default CategoryPage;
