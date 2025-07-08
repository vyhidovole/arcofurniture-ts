import React, { useEffect, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";

import { useLoading } from '@/context/LoadingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore";
import Alert from "@/components/ui/Alert/Alert";

import { ProductItem } from '@/types/types'
import styles from './bedroom.module.css'

const Bedroom = observer(() => {
  const { loading, setLoading } = useLoading();
  
  const [isShowAlert, setShowAlert] = useState(false);

  useEffect(() => {
    console.log("isShowAlert изменился на:", isShowAlert);
  }, [isShowAlert]);

  const handleAddToBasket = (item: ProductItem) => {
    if (!item) {
      console.error('handleAddToBasket called without item');
      return;
    }
    catalogueStore.addProductToBasket(item);
   
    console.log(`${item.name} добавлен в корзину!`);
    setShowAlert(true);
    console.log("Показать алерт:", true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  useEffect(() => {
    const url = '/Bedroom';
    setLoading(true);
    catalogueStore.getProducts(url).finally(() => {
      setLoading(false);
    });
  }, [setLoading]);

  const renderData =
    catalogueStore.products.length > 0 &&
    catalogueStore.products.map((item) => (
      <div key={item.uid} className={styles['main-container']}>
        <Image
          src={item.imgSrc || '/path/to/default-image.jpg'}
          alt={item.name}
          width={250}
          height={300}
          className={styles["bedroom-img"]}
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
              ></div>
            ))
          ) : (
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: item.color || 'gray',
                borderRadius: '50%',
              }}
            ></div>
          )}
        </div>
        <p>{item.price || 'Нет цены'}</p>
        <button
          className={styles["bedroom-button"]}
          onClick={() => handleAddToBasket(item)}
        >
          купить
        </button>
      </div>
    ));

  console.log("Текущая корзина:", catalogueStore.basket);
  console.log(catalogueStore.products);
  console.log("Количество уникальных товаров в корзине:", catalogueStore.quantity);

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

export default Bedroom;
