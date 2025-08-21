import React from 'react';
import { CiCreditCard1, CiBank } from 'react-icons/ci'; // Импортируем иконки для оплаты картой и через банк
import { TbCash } from 'react-icons/tb'; // Импортируем иконку для наличной оплаты
import Skeleton from 'react-loading-skeleton'; // Импортируем Skeleton для индикации загрузки
import 'react-loading-skeleton/dist/skeleton.css'; // Импортируем стили для Skeleton
import { useLoading } from '@/context/LoadingContext'; // Импорт вашего кастомного хука
import {useTheme} from '@/context/ThemeContext'
import styles from './payment.module.css';
/**
 * Компонент для отображения способов оплаты.
 * Загружает состояние и отображает доступные варианты оплаты.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий способы оплаты.
 *
 * @example
 * return <Payment />;
 */
const Payment = () => {
    const { loading } = useLoading(); // Получаем состояние загрузки из useLoading
    const {isDarkMode} = useTheme()

    return (
        <div className={`${styles.container} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
            {loading ? (
                <Skeleton count={5} />
            ) : (
                <>
                     <h1 className={styles.header}>Способы оплаты</h1>
            <div className={styles.container}>
                <h2 className={styles.subheader}>
                    <CiCreditCard1 className={styles.icon} /> Картой
                </h2>
                <p className={styles.description}>Visa / Mastercard</p>
            </div>
            <div className={styles.container}>
                <h2 className={styles.subheader}>
                    <TbCash className={styles.icon} /> Оплата наличными
                </h2>
            </div>
            <div className={styles.container}>
                <h2 className={styles.subheader}>
                    <CiBank className={styles.icon} /> Оплата через банк онлайн
                </h2>
                <p className={styles.description}>
                    Вы можете произвести оплату через интернет-банк, используя реквизиты, указанные в вашем заказе.
                </p>
            </div>
                </>
            )}
        </div>
    );
};

export default Payment;
