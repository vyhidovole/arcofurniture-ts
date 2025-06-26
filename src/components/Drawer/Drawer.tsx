import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { LiaTimesSolid } from "react-icons/lia"
import Basket from "@/components/ui/Basket";
import styles from "./Drawer.module.css"

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    titleDrawer: string
    isDarkMode?: boolean; // добавлено
    children?: React.ReactNode; // добавлено, если нужен children
}

/**
 * Компонент выдвигающейся панели.
 *
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.isOpen - Флаг, указывающий открыта/закрыта панель.
 * @param {Function} props.onClose - Функция обратного вызова при закрытии панели.
 * @param {ReactNode} props.children - Дочерние элементы панели.
 * @param {string} props.titleDrawer - Заголовок панели.
 */
export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, titleDrawer }) => {
    const drawerRef = useRef<HTMLDivElement | null>(null);

    /**
     * Функция для закрытия панели.
     *
     * @type {Function}
     */
    const closeDrawer = useCallback(() => {
        onClose();
    }, [onClose]);

    /**
     * Обработчик клика вне панели для закрытия панели.
     *
     * @type {Function}
     * @param {Event} event - Событие клика.
     */
    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
                closeDrawer();
            }
        },
        [drawerRef, closeDrawer]
    );

    /**
     * Добавляет или удаляет обработчик клика вне панели при открытии или закрытии панели.
     */

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [handleClick]);

    return (
        isOpen &&
        createPortal(
            <div className={styles["drawer-bg"]}>
                <aside
                    ref={drawerRef}
                    className={styles[`drawer-frame`]}
                >
                    <header className={styles["drawer-header"]}>
                        <h2 className={styles["titleDrawer"]}>{titleDrawer}</h2>
                        <button
                            onClick={closeDrawer}
                            className={styles["button-drawer"]}
                        >
                            <LiaTimesSolid />
                        </button>
                    </header>
                    <main> <Basket /> </main>
                    <footer className={styles ["footer-drawer"]}></footer>
                </aside>
            </div>,
            document.body
        )
    );
};
