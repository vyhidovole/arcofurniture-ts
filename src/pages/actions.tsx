import React, { useEffect, useState } from "react";
import { CiGrid41 } from "react-icons/ci";
import CustomSlider2 from '@/components/ui/Slider/CustomSlider2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


import styles from './actions.module.css'; // Импорт CSS стилей


// Типизация одного продукта
interface Product {
  id: number | string
  name: string
  imgSrc?: string
  category: string
  color: string | string[]
  price: string
}


/**
 * Компонент для отображения акций.
 * 
   React.FC: Принимает пропсы (по умолчанию пустые, если не указаны).
    Возвращает JSX-элемент или null.
    Имеет дополнительные свойства, например, children автоматически типизируются.

 */
const Actions: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Product[]>([])
  const [, setError] = useState<string>('');  // Новое состояние для ошибки


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status:${response.status}`)
        }
        // Опциональная проверка content-type для безопасности
        const contentType = response.headers.get('content-type') || ''
        if (!contentType?.includes('application/json')) {
          console.warn('Ответ не JSON, Content-Type:', contentType)
          throw new Error('Ответ сервера не является JSON')
        }

        const result = await response.json()
        setData(result)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        console.error('Ошибка при загрузке данных:', errorMessage);
        setError(errorMessage);

      }
      finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  return (
    <>
      {loading ? (
        <div className={styles['actions-skeleton-wrapper']}>
          <Skeleton height={60} width={160} className={styles['actions-skeleton-header']} />
          <Skeleton height={200} count={3} />
        </div>
      ) : (
        <>
          <div className={styles['actions-header']}>
            <CiGrid41 className={styles["actions-icon"]} />
            <h2 className={styles['actions-title']}>Акции</h2>
          </div>
          <CustomSlider2 data={data} loading={loading} />
        </>
      )}
    </>
  );
}

export default Actions
