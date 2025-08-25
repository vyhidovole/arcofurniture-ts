import React from "react";
// import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './FavoritePage.module.css'
/**
 * Компонент страницы избранного.
 * Отображает заголовок и навигацию для пользователя.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий страницу избранных заметок.
 *
 * @example
 * return <FavoritePage />;
 */
const FavoritePage = () => {
    // const router = useRouter();
    // Проверка, что router определён
  
    return (
        <>
            <h2 className={styles.title}>Мои заметки</h2>
            <div className={styles.container}>
                <Link href="/" className={styles.link}>Главная</Link>
                <span className={styles.separator}>-</span>
                <Link href="/privetofficepage" className={styles.link}>Личный кабинет</Link>
                <span className={styles.separator}>-</span>
                <p className={styles.notesText}>Мои заметки</p>
            </div>
        </>
    );
}

export default FavoritePage;