import React, { useEffect, useState } from "react";
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

/**
 * Компонент для отображения товаров по категории.
 * Загружает список товаров из MobX Store, отображает их и позволяет добавлять в корзину.
 */
const CategoryPageContent: React.FC<CategoryPageContentProps> = observer(({ category }) => {
  const { loading, setLoading } = useLoading(); // Получаем состояние загрузки
  const [isShowAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    catalogueStore.getProducts(`/${category}`).finally(() => {
      setLoading(false);
    });
  }, [category, setLoading]);

  const handleAddToBasket = (item: ProductItem) => {
    catalogueStore.addProductToBasket(item);

    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const renderData =
    catalogueStore.products.length > 0 &&
    catalogueStore.products.map((item: ProductItem) => (
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
    ));

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
