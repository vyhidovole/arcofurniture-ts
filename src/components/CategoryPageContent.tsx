
import React, { useEffect, useState } from "react";
import { reaction } from "mobx";
import Image from "next/image";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useLoading } from '@/context/LoadingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore";
import Alert from "@/components/ui/Alert/Alert";
import { ProductItem } from '@/types/types';
import styles from './CategoryPageContent.module.css';
import { normalizeCategory } from '@/utils/utils'; // импорт вашей функции
import { autorun } from "mobx";
interface CategoryPageContentProps {
  category: string;
}

const CategoryPageContent: React.FC<CategoryPageContentProps> = observer(({ category }) => {
  const { loading, setLoading } = useLoading();
  const [isShowAlert, setShowAlert] = useState(false);
useEffect(() => {
  const disposer = autorun(() => {
    const uids = catalogueStore.catalogueproducts.map(item => item.uid);
    const duplicates = uids.filter((uid, i) => uids.indexOf(uid) !== i);
    if (duplicates.length > 0) {
      console.warn("Duplicate uids found:", duplicates);

      // Дополнительно - вывести все uid с индексами
      catalogueStore.catalogueproducts.forEach((item, index) => {
        console.log(`uid[${index}]:`, item.uid);
      });
    }
  });

  return () => disposer();
}, []);

  useEffect(() => {
    if (!category) return;

    // Используем единую функцию нормализации
    const formattedCategory = normalizeCategory(category);

    setLoading(true);
    catalogueStore.loadInitialData(formattedCategory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, setLoading]);

  useEffect(() => {
    const disposer1 = reaction(
      () => catalogueStore.products.map(p => p.uid),
      (uids) => {
        const uniqueUids = new Set(uids);
        if (uids.length !== uniqueUids.size) {
          console.warn("Дублирующиеся uid в products:", uids);
        }
      },
      { fireImmediately: true }
    );
    const disposer2 = reaction(
      () => catalogueStore.catalogueproducts.map(c => c.uid),
      (uids) => {
        const uniqueUids = new Set(uids);
        if (uids.length !== uniqueUids.size) {
          console.warn("Дублирующиеся uid в catalogueproducts:", uids);
        }
      },
      { fireImmediately: true }
    );

    return () => {
      disposer1();
      disposer2();
    };
  }, []);

  const handleAddToBasket = (item: ProductItem) => {
    catalogueStore.addProductToBasket(item);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Если категория "all" — показываем список категорий
  if (normalizeCategory(category) === "all") {
    const categories = catalogueStore.catalogueproducts;

    return (
      <>
        <div className={styles["grid-container"]}>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={styles['small-container']}>
                <Skeleton height="100%" />
              </div>
            ))
          ) : categories.length > 0 ? (
            categories.map((cat, index) => {
              const id = cat.uid ?? cat.id ?? cat.name ?? `cat-${index}`;
              const key = `all-${id}-${index}`;


              return (
                <Link
                  key={key}
                  href={`/category/${encodeURIComponent(id)}`}
                  className={styles["category-button"]}
                >
                  {cat.name}
                </Link>
              );
            })
          ) : (
            <p>Категории не найдены</p>
          )}
        </div>

        {isShowAlert && (
          <Alert
            variant="positive"
            isOpen={isShowAlert}
            onClose={() => setShowAlert(false)}
          >
            <p>Товар добавлен в корзину!</p>
          </Alert>
        )}
      </>
    );
  }

  const renderData = catalogueStore.products.length > 0 ? (
    catalogueStore.products.map((item: ProductItem, index) => (
      <div key={`prod-${item.uid ?? item.id ?? item.name ?? index}-${index}`} className={styles["catalogue-container"]}>
        <Image
          src={item.imgSrc || "/default.jpg"}
          alt={item.name}
          width={250}
          height={185}
        />
        <div className={styles["catalogue-button"]}>{item.name}</div>
        <button
          className={styles["kitchen-button"]}
          onClick={() => handleAddToBasket(item)}
        >
          купить
        </button>
      </div>
    ))
  ) : (
    <p>Товары не найдены</p>
  );

  return (
    <>
      <div className={styles["grid-container"]}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles['small-container']}>
              <Skeleton height="100%" />
            </div>
          ))
        ) : (
          renderData
        )}
      </div>

      {isShowAlert && (
        <Alert
          variant="positive"
          isOpen={isShowAlert}
          onClose={() => setShowAlert(false)}
        >
          <p>Товар добавлен в корзину!</p>
        </Alert>
      )}
    </>
  );

});

export default CategoryPageContent;
