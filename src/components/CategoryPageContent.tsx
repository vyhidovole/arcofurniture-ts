
import React, { useEffect, useState } from "react";
import { reaction } from "mobx";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useLoading } from '@/context/LoadingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore";
import Alert from "@/components/ui/Alert/Alert";
import { ProductItem } from '@/types/types';
import styles from './CategoryPageContent.module.css';

interface CategoryPageContentProps {
  category: string;
}

const CategoryPageContent: React.FC<CategoryPageContentProps> = observer(({ category }) => {
  const { loading, setLoading } = useLoading();
  const [isShowAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!category) return;

    const formattedCategory = category
      .trim()
      .replace(/^\/|\/$/g, '')
      .toLowerCase()
      .replace(/\s+/g, '_');

    setLoading(true);
    catalogueStore.loadInitialData(formattedCategory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, setLoading]);

  useEffect(() => {
    const disposer = reaction(
      () => catalogueStore.products.map(p => p.uid),
      (uids) => {
        const uniqueUids = new Set(uids);
        if (uids.length !== uniqueUids.size) {
          console.warn("Дублирующиеся uid в products:", uids);
        }
      },
      { fireImmediately: true }
    );

    return () => disposer();
  }, []);

  const handleAddToBasket = (item: ProductItem) => {
    catalogueStore.addProductToBasket(item);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const renderData = catalogueStore.products.length > 0 ? (
    catalogueStore.products.map((item: ProductItem) => {
      console.log("Рендеринг продукта с uid:", item.uid, "name:", item.name);
      return (
        <div key={item.uid} className={styles['main-container']}>
          <Image
            src={item.imgSrc || '/path/to/default-image.jpg'}
            alt={item.name}
            width={250}
            height={300}
            layout="responsive"
            className={styles["kitchen-img"]}
          />
          <h2>{item.name || 'Нет имени'}</h2>
          <p>{item.category || 'Нет категории'}</p>
          <div className={styles['color-container']}>
            {Array.isArray(item.color) ? (
              item.color.map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    borderRadius: '10%',
                    marginRight: '4px',
                  }}
                />
              ))
            ) : (
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: item.color || 'gray',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>
          <p>{item.price || 'Нет цены'}</p>
          <button
            className={styles["kitchen-button"]}
            onClick={() => handleAddToBasket(item)}
          >
            купить
          </button>
        </div>
      );
    })
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
