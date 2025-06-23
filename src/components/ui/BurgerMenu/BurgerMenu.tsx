import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { LiaTimesSolid } from "react-icons/lia"
import Modal from "@/components/ui/Modal/Modal"; // Импортируем модальное окно
import ModalCall from "@/components/ui/Modal/ModalCall"; // Импортируем модальное окно
import ModalEntry from "@/components/ui/Modal/ModalEntry";// Импортируем диалоговое окно


interface BurgerMenuProps {
    titleBurger: string
    isOpen: boolean
    onClose: () => void
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
 * @param {string} props.titleBurger - Заголовок панели.
 */
const BurgerMenu: React.FC<BurgerMenuProps> = ({ isOpen, onClose, titleBurger,isDarkMode }) => {
    const burgerRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
    const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
    const [, setNewForm] = useState(false);


    /**
     * Функция для закрытия панели.
     *
     * @type {function}
     */
    const closeBurger = useCallback(() => {
        onClose();
    }, [onClose]);

    /**
     * Обработчик клика вне панели для закрытия панели.
     *
     * @type {function}
     * @param {Event} event - Событие клика.
     */
    const handleClick = useCallback(
        (event: MouseEvent) => {
            if (burgerRef.current && !burgerRef.current.contains(event.target as Node)) {
                closeBurger();
            }
        },
        [burgerRef, closeBurger]
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

    // Функции для открытия и закрытия модальных окон
    const handleOpenModal = () => {
        console.log("address"); // Логируем сообщение для тестирования
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    const openCallDialog = () => setIsCallDialogOpen(true);
    const closeCallDialog = () => setIsCallDialogOpen(false);

    const openEntryDialog = () => {
        console.log("entry")
        setIsEntryDialogOpen(true);
    }
    const closeEntryDialog = () => setIsEntryDialogOpen(false);



    return (
        <>
            {isOpen &&
                createPortal(
                    <div className="modal-overlay">
                        <aside
                            ref={burgerRef}
                            className={`burger-menu`}
                        >
                            <header className="header-burger">
                                <h2 className="title-burger">{titleBurger}</h2>
                                <button
                                    onClick={closeBurger}
                                    className="close-burger"
                                >
                                    <LiaTimesSolid />
                                </button>
                            </header>
                            <main className="flex-grow" >
                                <ul>
                                    <Link href="/kitchen" passHref> <li>Кухни</li></Link>
                                    <Link href="/bedroom" passHref> <li>Спальни</li></Link>
                                    <Link href="/nursery" passHref><li>Детские</li></Link>
                                    <Link href="/drawing-room" passHref><li>Гостиные</li></Link>
                                    <Link href="/couch" passHref><li>Диваны</li></Link>
                                    <Link href="/hallway" passHref><li>Прихожие</li></Link>
                                    <Link href="/cupboard" passHref><li>Шкафы-купе</li></Link>
                                </ul>
                            </main>
                            <footer className="burger-footer">
                                <ul>
                                    <li>
                                        <div>
                                            <p>ул.Московская 144 корп.-1</p>
                                            <button className="text-red-500 underline" onClick={handleOpenModal}>
                                                Схема проезда
                                            </button>
                                        </div>
                                    </li>
                                    <li className="mt-4">
                                        <div className="flex">
                                            <h4 className="">8(961)5259191</h4>
                                            <button className="phone-button" onClick={openCallDialog}>
                                                Заказать звонок
                                            </button>
                                        </div>
                                    </li>
                                    <li className="li">
                                        <button type="button" className="button-entry" onClick={openEntryDialog}>
                                            Войти
                                        </button>
                                    </li>
                                </ul>
                            </footer>
                        </aside>
                    </div>,
                    document.body
                )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}isDarkMode={isDarkMode?? false} />
            <ModalCall isOpen={isCallDialogOpen} onClose={closeCallDialog} setNewForm={setNewForm} />
            <ModalEntry show={isEntryDialogOpen} onClose={closeEntryDialog} setNewForm={setNewForm} />
        </>
    );
};
export default BurgerMenu