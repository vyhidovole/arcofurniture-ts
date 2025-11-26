import React, { useEffect } from "react";
import { CiLocationOn } from "react-icons/ci";
import { CiClock2 } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { GoMail } from "react-icons/go";
import { useLoading } from '@/context/LoadingContext'; // Импортируем контекст загрузки
import { useTheme } from '@/context/ThemeContext'
import Skeleton from 'react-loading-skeleton'; // Импортируем скелетон
import 'react-loading-skeleton/dist/skeleton.css'; // Импортируем стили для скелетона
import styles from './contacts.module.css'

/**
 * Компонент для отображения контактной информации.
 * Загружает и отображает информацию о компании, включая адрес, время работы, телефон и email.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий контактную информацию.
 *
 * @example
 * return (
 *   <Contacts />
 * );
 */
const Contacts = () => {
    const { isDarkMode } = useTheme()
    const { loading, setLoading } = useLoading(); // Получаем состояние загрузки
    //const [contacts, setContacts] = useState([]);//для примера

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Здесь  можно добавить логику загрузки данных
            //     try {
            //         const response = await fetch('/api/contacts');
            //         const data = await response.json();
            //         // Обработать данные...
            //          setContacts(data);
            //         setLoading(false);
            //     } catch (error) {
            //         console.error(error);
            //         setLoading(false); // Или показать ошибку
            //     }
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитация загрузки
            setLoading(false);
        };

        fetchData();
    }, [setLoading]);


    return (
        <>
            {loading ? (
                <Skeleton height={400} width="100%" /> // Скелетон для логотипа
            ) : (
                <div className={`${styles['contact-container']} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                    <h2 className={styles["contact-title"]}>Связаться с нами</h2>
                    <div className={styles["contact-info-container"]}>
                        <div className={styles["contact-item"]}>
                            <div className={styles["contact-icon"]}><CiLocationOn /></div>
                            <div className={styles["contact-details"]}>
                                <p>Адрес:</p>
                                <p>ул. Московская 144 корп. - 1</p>
                            </div>
                        </div>
                        <div className={styles["contact-item"]}>
                            <div className={styles["contact-icon"]}><CiClock2 /></div>
                            <div className="contact-details">
                                <p>Время работы:</p>
                                <p>с 10:00 до 19:00</p>
                            </div>
                        </div>
                        <div className={styles["contact-item"]}>
                            <div className={styles["contact-icon"]}><LuPhone /></div>
                            <div className={styles["contact-details"]}>
                                <p>Телефон:</p>
                                <p>+7(961)5259191</p>
                            </div>
                        </div>
                        <div className={styles["contact-item"]}>
                            <div className={styles["contact-icon"]}><GoMail /></div>
                            <div className={styles["contact-details"]}>
                                <p>Email:</p>
                                <p>mebelarco@mail.ru</p>
                            </div>
                        </div>
                    </div>
                    <h3 className={styles["address-title"]}>Наши адреса</h3>
                    <p className={styles["address-text"]}>Краснодар, ул. Московская 144 корп. - 1</p>
                    <div className={styles['address-details']}>
                        <CiClock2 />
                        <div className={styles["address-info"]}>
                            <p>с 10:00 до 19:00</p>
                        </div>
                    </div>
                    <div className={styles["address-details"]}>
                        <LuPhone />
                        <div className={styles["address-info"]}>
                            <p>+7(961)5259191</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

}

export default Contacts;