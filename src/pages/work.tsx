import React, { useEffect, useState } from "react";
import catalogueStore from "@/store/CatalogueStore"; // Импортируйте ваше MobX хранилище
import { useLoading } from '@/context/LoadingContext'; // Импортируйте хук контекста загрузки
import { useTheme } from '@/context/ThemeContext'
import Skeleton from 'react-loading-skeleton';
import Image from "next/image";
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
    const { loading, setLoading } = useLoading()
    const [errorMessage, setErrorMessage] = useState('')
    const { isDarkMode } = useTheme()

    useEffect(() => {
        setLoading(true)
        setErrorMessage('')

        const fetchData = async () => {
            try {
                const apiUrl = '/api/works'
                const response = await fetch(apiUrl)
                
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP ${response.status}:${response.statusText}`)
                }
                // Проверка content-type (опционально, но полезно для логов)
                const contentType = response.headers.get('content-type') || ''
                if (!contentType.includes('application/json')) {
                    console.warn('Ответ не JSON, Content-Type:', contentType)
                    
                    throw new Error('Ответ сервера не является JSON')

                }
                // Автоматический парсинг в объект с помощью .json()
                const data = await response.json()
                console.log('Разобранные данные:', data);  // Для отладки
                catalogueStore.getWorkItems(data)
            } catch (error) {
                if (error instanceof SyntaxError) {
                     // Если .json() не смог распарсить (не валидный JSON)
                    console.error('Ошибка парсинга JSON:', error)
                    setErrorMessage('Ошибка парсинга  данных:')
                } else if(error instanceof Error) {
                    console.error('Ошибка при получении данных:', error)
                    setErrorMessage(`Ошибка при получении данных: ${error.message}`)
                } else{
                    console.error('Неизвестная ошибка:', error)
                    setErrorMessage('Неизвестная ошибка при получении данных')
                }
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [setLoading])

    const workItems = Array.isArray(catalogueStore.workItems) ? catalogueStore.workItems : []
    console.log('Работы', workItems)

    const renderData = workItems.map((item) => (
        <div key={item.id} className={styles.card}>
            <Image
                src={item.imgSrc || '/images/inst.jpg'}
                alt={item.id.toString()}
                className={styles.image}
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                style={{ objectFit: 'cover' }}
            />
        </div>
    ))

    return (
        <div className={`${styles.container} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
            <h2 className={styles.title}>Наши работы</h2>
            {loading ? (
                <div className={styles.skeleton}>
                    <Skeleton height='100%' />
                </div>
            ) : errorMessage ? (
                <div className={styles.error}>{errorMessage}</div>
            ) : renderData.length > 0 ? (
                renderData
            ) : (
                <div>Нет доступных работ</div>
            )}
        </div>
    );
})

export default Work;