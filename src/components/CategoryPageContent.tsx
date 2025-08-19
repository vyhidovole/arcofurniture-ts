
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useLoading } from '@/context/LoadingContext';
import {useTheme} from '@/context/ThemeContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore";
import Alert from "@/components/ui/Alert/Alert";
import styles from './CategoryPageContent.module.css';
import { normalizeCategory } from '@/utils/utils';
import { ProductItem } from "@/types/types";

interface CategoryPageContentProps {
  category: string;
}

const CategoryPageContent: React.FC<CategoryPageContentProps> = observer(({ category }) => {
  const { loading, setLoading } = useLoading();
  const {isDarkMode} = useTheme()
  const [isShowAlert, setShowAlert] = useState(false);
  const normalizedCategory = normalizeCategory(category);


  useEffect(() => {
    if (!category) return;

    const load = async () => {
      setLoading(true);
      await catalogueStore.loadProductsByCategory(normalizedCategory);
      setLoading(false);
    };

    load();
  }, [category, normalizedCategory, setLoading]);

  const handleAddToBasket = (item:ProductItem) => {
    catalogueStore.addProductToBasket(item);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const renderLoadingSkeletons = () => (
    Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className={styles['small-container']}>
        <Skeleton height={250} />
      </div>
    ))
  );

  const products = catalogueStore.products;

  return (
    <>
      <div className={`${styles["grid-container"]} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
        {loading ? renderLoadingSkeletons() : products.length > 0 ? (
          products.map(item => (
            <div  key={`${item.id}-${item.category}`} className={styles["catalogue-container"]}>
              <Image
                src={item.imgSrc || "/default.jpg"}
                alt={item.name}
                width={250}
                height={185}
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
          ))
        ) : (
          <p>Товары не найдены</p>
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
