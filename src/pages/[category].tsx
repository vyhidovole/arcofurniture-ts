import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import CategoryPageContent from "@/components/CategoryPageContent";

const CategoryPage = observer(() => {
  const router = useRouter();
  const { category } = router.query;
 

  if (!category || Array.isArray(category)) {
    return <div>Загрузка категории...</div>;
  }

  return <CategoryPageContent category={category} />;
});

export default CategoryPage;
