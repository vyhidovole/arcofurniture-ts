import React, { useEffect, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useLoading } from '@/context/LoadingContext'; // Хук для управления состоянием загрузки
import Skeleton from 'react-loading-skeleton'; // Скеле́тон для отображения загрузочного состояния
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore"; // MobX store с данными каталога
import Alert from "@/components/ui/Alert/Alert"; // Компонент для уведомлений
import { ProductItem } from '@/types/types'; // Типизация товара
import styles from './CategoryPageContent.module.css';

interface CategoryPageContentProps {
  category: string; // Категория товаров, которую нужно загрузить и отобразить
}

/**
 * Компонент отображает список товаров из выбранной категории.
 * Использует MobX-стор для загрузки и хранения товаров.
 * Показывает скелетоны во время загрузки.
 * Позволяет добавить товар в корзину с уведомлением.
 */
const CategoryPageContent: React.FC<CategoryPageContentProps> = observer(({ category }) => {
  // Получаем из контекста состояние загрузки и функцию для его установки
  const { loading, setLoading } = useLoading();
  
  // Локальное состояние для показа уведомления об успешном добавлении товара в корзину
  const [isShowAlert, setShowAlert] = useState(false);

  /**
   * Хук useEffect вызывается при изменении категории.
   * Запускает загрузку товаров из MobX-стора.
   */
  useEffect(() => {
    // Если категория пустая, не делаем ничего
    if (!category) return;

    // Устанавливаем состояние загрузки в true, чтобы показать скелетоны
    setLoading(true);

    // Вызываем метод getProducts из MobX-стора с категорией
    // Важно: передаём категорию без ведущего слэша, т.к. метод внутри сам убирает слэш
    catalogueStore.getProducts(category)
      .catch(err => {
        // Логируем ошибку в консоль
        console.error("Ошибка загрузки товаров:", err);
        // Здесь можно добавить UI для отображения ошибки пользователю, если нужно
      })
      .finally(() => {
        // После загрузки (успешной или с ошибкой) выключаем индикатор загрузки
        setLoading(false);
      });
  }, [category, setLoading]); // Зависимости: вызываем при изменении категории или функции setLoading

  /**
   * Обработчик нажатия кнопки "купить".
   * Добавляет товар в корзину через MobX-стор и показывает уведомление.
   */
  const handleAddToBasket = (item: ProductItem) => {
    // Добавляем товар в корзину
    catalogueStore.addProductToBasket(item);

    // Показываем уведомление
    setShowAlert(true);

    // Через 3 секунды скрываем уведомление
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  /**
   * Формируем JSX для отображения списка товаров.
   * Если товаров нет, показываем сообщение.
   */
  const renderData = catalogueStore.products.length > 0 ? (
    catalogueStore.products.map((item: ProductItem) => (
      <div key={item.uid} className={styles['main-container']}>
        {/* Картинка товара с fallback-изображением */}
        <Image
          src={item.imgSrc || '/path/to/default-image.jpg'}
          alt={item.name}
          width={250}
          height={300}
          layout="responsive"
          className={styles["kitchen-img"]}
        />
        {/* Название товара */}
        <h2>{item.name || 'Нет имени'}</h2>
        {/* Категория товара */}
        <p>{item.category || 'Нет категории'}</p>
        {/* Цвета товара — если массив, отображаем каждый цвет, иначе один цвет */}
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
        {/* Цена товара */}
        <p>{item.price || 'Нет цены'}</p>
        {/* Кнопка добавления в корзину */}
        <button
          className={styles["kitchen-button"]}
          onClick={() => handleAddToBasket(item)}
        >
          купить
        </button>
      </div>
    ))
  ) : (
    // Если товаров нет, показываем сообщение
    <p>Товары не найдены</p>
  );

  return (
    <>
      {/* Контейнер с сеткой товаров */}
      <div className={styles["grid-container"]}>
        {loading ? (
          // Пока идёт загрузка, показываем 8 скелетонов-заглушек
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles['small-container']}>
              <Skeleton height="100%" />
            </div>
          ))
        ) : (
          // После загрузки показываем товары или сообщение
          renderData
        )}
      </div>

      {/* Уведомление об успешном добавлении товара в корзину */}
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

// Оборачиваем компонент в observer, чтобы он реагировал на изменения MobX-стора
export default CategoryPageContent;
