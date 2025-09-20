
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from 'next/router';
import Link from "next/link";
import { LiaTimesSolid } from "react-icons/lia";
import { useLoading } from '@/context/LoadingContext';
import Modal from "@/components/ui/Modal/Modal";
import ModalCall from "@/components/ui/ModalCall/ModalCall";
import ModalEntry from "@/components/ui/ModalEntry/ModalEntry";
import styles from "./BurgerMenu.module.css";

type NavItem = {
    name: string;
    path: string;
};

const navItems: NavItem[] = [
    { name: 'Главная', path: '/' },
    { name: 'Акции', path: '/actions' },
    { name: 'Сборка', path: '/assembling' },
    { name: 'Оплата', path: '/payment' },
    { name: 'Доставка', path: '/delivery' },
];

interface BurgerMenuProps {
    titleBurger: string;
    isOpen: boolean;
    onClose: () => void;
    isDarkMode?: boolean; // Проп для применения темы (светлая/темная) без useTheme
}

/**
 * Компонент выдвигающейся панели.
 *
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.isOpen - Флаг, указывающий открыта/закрыта панель.
 * @param {Function} props.onClose - Функция обратного вызова при закрытии панели.
 * @param {string} props.titleBurger - Заголовок панели.
 * @param {boolean} [props.isDarkMode] - Флаг, указывающий, используется ли темная тема (опционально).
 */
const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose, titleBurger, isDarkMode }) => {
    const burgerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [, setNewForm] = useState(false);
    const { loading, setLoading } = useLoading();
    const router = useRouter();



    const categories = [
        { slug: 'kitchen', label: 'Кухни' },
        { slug: 'bedroom', label: 'Спальни' },
        { slug: 'nursery', label: 'Детские' },
        { slug: 'drawingroom', label: 'Гостиные' },
        { slug: 'couch', label: 'Диваны' },
        { slug: 'hallway', label: 'Прихожие' },
        { slug: 'cupboard', label: 'Шкафы-купе' },
    ];

    const closeBurger = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (burgerRef.current && !burgerRef.current.contains(event.target as Node)) {
                closeBurger();
            }
        },
        [burgerRef, closeBurger]
    );

    useEffect(() => {
        document.addEventListener('pointerdown', handleClick);
        return () => {
            document.removeEventListener('pointerdown', handleClick);
        };
    }, [handleClick]);

    const onClickHandler = (path: string) => {
        setLoading(true);
        router.push(path).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
        closeBurger();  // Закрываем меню после навигации
    };


    const handleOpenModal = () => {
        closeBurger();
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const openCallDialog = () => {
        closeBurger();
        setIsCallDialogOpen(true);
    };
    const closeCallDialog = () => setIsCallDialogOpen(false);

    const openEntryDialog = () => {
        closeBurger();
        setIsEntryDialogOpen(true);
    };
    const closeEntryDialog = () => setIsEntryDialogOpen(false);

    // Применение темы через проп isDarkMode (без useTheme)
    const themeClass = isDarkMode ? styles.dark : styles.light;

    return (
        <>
            {isOpen &&
                createPortal(
                    <div className={styles["modal-overlay"]}>
                        <aside
                            ref={burgerRef}
                            className={`${styles["burger-menu"]} ${themeClass}`}
                        >
                            <header className={styles["header-burger"]}>
                                <h2 className={styles["title-burger"]}>{titleBurger}</h2>
                                <button
                                    onClick={closeBurger}
                                    className={styles["close-burger"]}
                                >
                                    <LiaTimesSolid />
                                </button>
                            </header>
                            <main className={styles["burger-container"]}>
                                <ul>
                                    {loading ? (
                                        // Без скелетонов — простой текст вместо загрузки
                                        <li>Загрузка...</li>
                                    ) : (
                                        navItems.map((item) => {

                                            return (
                                                <li key={item.path}>
                                                    <Link
                                                        href={item.path}
                                                        className={`${styles.navLink} ${styles.relative} ${styles.cursorPointer}`}
                                                        onClick={() => onClickHandler(item.path)}
                                                    >
                                                        {item.name}
                                                    </Link>

                                                </li>
                                            );
                                        })
                                    )}
                                    {categories.map(category => (
                                        <li key={category.slug}>
                                            <Link
                                                href={`/category/${category.slug}`}
                                                className={`${styles.navLink} ${styles.relative} ${styles.cursorPointer} 
                                                ${styles.textGray800}`} onClick={closeBurger}
                                            >
                                                {category.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </main>
                            <footer className={styles["burger-footer"]}>
                                <ul>
                                    <li>
                                        <div>
                                            <p>ул.Московская 144 корп.-1</p>
                                            <button className={styles["address-button"]} onClick={handleOpenModal}>
                                                Схема проезда
                                            </button>
                                        </div>
                                    </li>
                                    <li className={styles["li-callButton"]}>
                                        <div className={styles["callButton-container"]}>
                                            <h4>8(961)5259191</h4>
                                            <button className={styles["phone-button"]} onClick={openCallDialog}>
                                                Заказать звонок
                                            </button>
                                        </div>
                                    </li>
                                    <li className={styles["li"]}>
                                        <button type="button" className={styles["button-entry"]} onClick={openEntryDialog}>
                                            Войти
                                        </button>
                                    </li>
                                </ul>
                            </footer>
                        </aside>
                    </div>,
                    document.body
                )
            }
            {/* Модальные окна */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} isDarkMode={isDarkMode ?? false} />
            <ModalCall isOpen={isCallDialogOpen} onClose={closeCallDialog} setNewForm={setNewForm} />
            <ModalEntry show={isEntryDialogOpen} onClose={closeEntryDialog} setNewForm={setNewForm} />
        </>
    );
};

export default BurgerMenu;
