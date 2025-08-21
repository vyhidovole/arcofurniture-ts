import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoading } from '@/context/LoadingContext'; // Импорт вашего кастомного хука
import {useTheme} from '@/context/ThemeContext'
import styles from './delivery.module.css';
/**
 * Компонент для отображения информации о доставке и оплате.
 * Загружает состояние из контекста загрузки и отображает либо скелетон, либо информацию о доставке.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий информацию о доставке и оплате.
 *
 * @example
 * return <Delivery />;
 */
const Delivery = () => {
    const { loading } = useLoading(); // Получаем состояние загрузки из useLoading
    const {isDarkMode} = useTheme()

    return (
        <div className={`${styles.container} ${isDarkMode ? 'bg-dark': 'bg-light'} `}>
            {loading ? (
                <Skeleton count={10} />
            ) : (
                <>
                    <h1 className={styles.header}>Доставка и оплата</h1>
                    <h2 className={styles.subheader}>
                        При заказе мебели предоплата составляет 30% от общей суммы по договору, остаток оплачивается уже после получения и приемки товара.
                    </h2>
                    <p className={styles.paragraph}>Сборка оплачивается отдельно.</p>

                    <h3 className={styles.subheader}>Стоимость услуг</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Услуга</th>
                                <th>Стоимость</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Доставка по городу до подъезда</td>
                                <td>800 руб</td>
                            </tr>
                            <tr>
                                <td>Доставка по городу с подъемом</td>
                                <td>от 1200 руб</td>
                            </tr>
                            <tr>
                                <td>Доставка за город</td>
                                <td>45 руб/км</td>
                            </tr>
                            <tr>
                                <td>Поэтажный подъем столешниц 3 метра и меньше (в лифт не входит)</td>
                                <td>300 руб/этаж</td>
                            </tr>
                            <tr>
                                <td>Для столешниц более 3х метров - услуга поэтажного подъема не предоставляется</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                    <p className={styles['mt-4']}>
                        Доставка по городу с заносом в помещение осуществляется при возможности подъезда грузового автомобиля ко входу или подъезду на расстоянии не более 10 метров, а также при работающем грузовом лифте, в который помещаются все позиции заказа. В иных случаях стоимость рассчитывается и согласовывается с сотрудниками доставки, в зависимости от расстояний и объема заказа.
                    </p>
                </>
            )}
        </div>
    );
};

export default Delivery;