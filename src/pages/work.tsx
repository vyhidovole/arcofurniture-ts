import React, { useEffect, useState } from "react";
import catalogueStore from "@/store/CatalogueStore"; // Импортируйте ваше MobX хранилище
import { useLoading } from '@/context/LoadingContext'; // Импортируйте хук контекста загрузки
import {useTheme} from '@/context/ThemeContext'
import Skeleton from 'react-loading-skeleton';
import Image from "next/image";
// import { WorkItem } from "@/types/types";
import { observer } from 'mobx-react-lite'; // или 'mobx-react'
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './work.module.css'; // Импортируйте ваш CSS-модуль


/**
 * Компонент для отображения работ.
 * Загружает список работ из API и отображает их в виде карточек.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий список работ.
 *
 * @example
 * return <Work />;
 */

const Work = observer(() => {
    const { loading, setLoading } = useLoading();
    const [errorMessage, setErrorMessage] = useState('');
    const {isDarkMode} = useTheme()

    useEffect(() => {
        console.log('useEffect вызван');
        const url = '/work'; // Указываем путь к файлу db.json
        console.log('Запрос к API:', url);
        setLoading(true);
        setErrorMessage(''); // Сброс сообщения об ошибке перед новым запросом

        const fetchData = async () => {
            try {
                // const url = '/db.json'; 
                const response = await fetch('http://localhost:3002/work');

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();
                catalogueStore.getWorkItems(data);
            } catch (error) {
                // Проверка типа ошибки
                if (error instanceof Error) {
                    console.error('Ошибка при получении данных:', error);
                    setErrorMessage('Ошибка при получении данных: ' + error.message);
                } else {
                    console.error('Неизвестная ошибка при получении данных:', error);
                    setErrorMessage('Неизвестная ошибка при получении данных.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setLoading]);

    const workItems = Array.isArray(catalogueStore.workItems) ? catalogueStore.workItems : [];

    console.log('Работы:', workItems);

    const renderData = workItems.map((item) => (
        <div key={item.id} className={styles.card}>

            <Image
                src={item.imgSrc || '/images/inst.jpg'}
                alt={item.id}
                className={styles.image}
                fill        // вместо width/height → растягивается на 100% родителя
                sizes="(min-width: 1024px) 400px, 100vw"
                style={{ objectFit: 'cover' }}
            />
        </div>
    ));

    return (
        <div className={`${styles.container} ${isDarkMode ? 'bg-dark': 'bg-light'}`}>
            <h2 className={styles.title}>Наши работы</h2>
            {loading ? (
                <div className={styles.skeleton}>
                    <Skeleton height="100%" />
                </div>
            ) : errorMessage ? (
                <div className={styles.error}>{errorMessage}</div> // Отображаем сообщение об ошибке
            ) : (
                renderData.length > 0 ? renderData : <div>Нет доступных работ.</div>
            )}
        </div>
    );
});

export default Work;