// import { useRouter } from "next/router";
// import { observer } from "mobx-react-lite";
// import CategoryPageContent from "@/components/CategoryPageContent";

// const CategoryPage = observer(() => {
//   const router = useRouter();
//   const { category } = router.query;
 

//   if (!category || Array.isArray(category)) {
//     return <div>Загрузка категории...</div>;
//   }

//   return <CategoryPageContent category={category} />;
// });

// export default CategoryPage;
import { useRouter } from 'next/router';
import CategoryPageContent from '@/components/CategoryPageContent';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
 const categoryStr = !category || Array.isArray(category) ? "all" : category;
 

  return (
    <div>
      <h1>Категория: {category}</h1>
      <CategoryPageContent category={categoryStr} />
    </div>
  );
};

export default CategoryPage;
