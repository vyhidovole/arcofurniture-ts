import React, { useEffect, useState } from "react";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { useLoading } from '@/context/LoadingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import catalogueStore from "@/store/CatalogueStore";
import Alert from "@/components/ui/Alert/Alert";

import { ProductItem } from '@/types/types'
import styles from './tables-and-chairs.module.css'
/**
 * Компонент для отображения и управления товарами (прихожие).
 * Загружает список товаров, отображает их и позволяет добавлять в корзину.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий список коридоров.
 *
 * @example
 * return <Hallway />;
 */
const Tables_and_chairs = observer(() => {
    const { loading, setLoading } = useLoading(); // Получаем состояние загрузки
    
    // Стейт для закрытия компонента уведомления
    const [isShowAlert, setShowAlert] = useState(false);
    useEffect(() => {
        console.log("isShowAlert изменился на:", isShowAlert);
    }, [isShowAlert]);


    /**
     * Функция для добавления товара в корзину.
     * Добавляет продукт в корзину и отображает уведомление.
     *
     * @param {Object} item - Объект товара, который нужно добавить в корзину.
     */
    function handleAddToBasket(item: ProductItem): void {
    catalogueStore.addProductToBasket(item);
    console.log(`${item.name} добавлен в корзину!`);
    setShowAlert(true);
    console.log("Показать алерт:", true);
    setTimeout(() => {
        setShowAlert(false);
    }, 3000);
}

    useEffect(() => {
        const url = '/Tables_and_chairs'; // Определяем конечный URL 
        setLoading(true); // Устанавливаем состояние загрузки в true
        catalogueStore.getProducts(url).finally(() => {
            setLoading(false); // Устанавливаем состояние загрузки в false после завершения запроса
        });
    }, [setLoading]);


    // Итерация по данным и отрисовка карточек
    const renderData =
        catalogueStore.products.length > 0 &&
        catalogueStore.products.map((item) => (
            <div key={item.uid} className={styles['main-container']}>
                <Image
                    src={item.imgSrc || '/path/to/default-image.jpg'}
                    alt={item.name}
                    width={250}
                    height={300}
                    className={styles['hallway-img']}
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
                                backgroundColor: item.color || 'gray', // Цвет по умолчанию
                                borderRadius: '50%',
                            }}
                        ></div>
                    )}
                </div>
                <p>{item.price || 'Нет цены'}</p>
                <button
                    className={styles['hallway-button']}
                    onClick={() => handleAddToBasket(item)} >
                    купить
                </button>
            </div>
        ));
    console.log("Текущая корзина:", catalogueStore.basket);
    console.log(catalogueStore.products); // Логируем продукты для отладки
    console.log("Количество уникальных товаров в корзине:", catalogueStore.quantity); // Логируем количество уникальных товаров

    return (
        <>
            <div className={styles['grid-container']}>
                {loading ? (
                    // Отображение Skeleton, пока данные загружаются
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

export default Tables_and_chairs;