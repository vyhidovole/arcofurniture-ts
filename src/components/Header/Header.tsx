import React, { useState, useEffect } from "react";
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import Image from "next/image";
import Link from "next/link";
import { useLoading } from '@/context/LoadingContext'; // Импортируем контекст загрузки
import Skeleton from 'react-loading-skeleton'; // Импортируем скелетон
import 'react-loading-skeleton/dist/skeleton.css'; // Импортируем стили для скелетона
import Modal from "@/components/ui/Modal/Modal"; // Импортируем модальное окно
import ModalCall from "@/components/ui/Modal/ModalCall"; // Импортируем модальное окно
import ModalEntry from "@/components/ui/Modal/ModalEntry";// Импортируем диалоговое окно
import { useRouter } from 'next/router';
import { Drawer } from "@/components/Drawer/Drawer";
import '@/components/Header/Header.module.css';
import BurgerButton from "@/components/ui/BurgerButton/BurgerButton";
import  BurgerMenu  from "@/components/ui/BurgerMenu/BurgerMenu";
import SearchInput from "@/components/ui/Input/SearchInput";



/**
 * Компонент Header отображает верхнюю часть страницы с логотипом,
 * кнопками для открытия модальных окон и информацией о корзине.
 *
 * Этот компонент использует контексты для темы, корзины и загрузки,
 * а также управляет состоянием открытых/закрытых модальных окон и
 * бокового меню (drawer).
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий заголовок страницы.
 *
 * @example
 * <Header />
 */
const Header = () => {
  const { isDarkMode } = useTheme(); // Получаем доступ к теме
  const { count } = useCart(); // Используем контекст
  const router = useRouter();
  const { loading, setLoading } = useLoading(); // Получаем состояние загрузки
 

  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна
  const [isCallModalOpen, setCallModalOpen] = useState(false); // Состояние для ModalCall
  const [isEntryModalOpen, setEntryModalOpen] = useState(false); // Состояние для ModalEntry
  const [, setNewFormState] = useState(false);
  const [isDrowerOpen, setIsDrowerOpen] = useState(false)
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)

  const handleSetNewForm = (value: boolean) => {
  setNewFormState(value);
};

  const handleOpenModal = () => {
    setIsModalOpen(true); // Открываем модальное окно
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Закрываем модальное окно
  };

  const openCallDialog = () => {
    setCallModalOpen(true); // Открываем модальное окно для заказа звонка
  };

  const closeCallDialog = () => {
    setCallModalOpen(false); // Закрываем модальное окно для заказа звонка
  };

  const openEntryDialog = () => {
    setEntryModalOpen(true); // Открываем модальное окно для входа
  };

  const closeEntryDialog = () => {
    setEntryModalOpen(false); // Закрываем модальное окно для входа
  };


  const handleOpenDrower = () => {
    setIsDrowerOpen(true)
  }
  const handleCloseDrower = () => {
    setIsDrowerOpen(false)
  }



  const handleOpenBurger = () => {
    setIsBurgerOpen(true)
    console.log("бургер меню открыто")
  }
  const handleCloseBurger = () => {
    setIsBurgerOpen(false)
    console.log("бургер меню закрыто")
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Здесь  можно добавить логику загрузки данных
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Имитация загрузки
      setLoading(false);
    };

    fetchData();
  }, [setLoading]);
 // Проверка, что router определён
  if (!router) {
    return null; // или можно вернуть загрузочный индикатор
  }
  return (<div className="headerContainer">
    <BurgerButton onClick={handleOpenBurger} />
    <BurgerMenu isOpen={isBurgerOpen} onClose={handleCloseBurger} titleBurger="меню" />
    {loading ? (
      <Skeleton height={30} width={180} /> // Скелетон для логотипа
    ) : (
      <Image
        src={"/images/logo.jpg"}
        alt="арко"
        width={180}
        height={30}
        priority={true}
      />
    )}
    <div className="address">
      {loading ? (
        <Skeleton height={20} width={200} />
      ) : (
        <p>ул.Московская 144 корп.-1</p>
      )}

      <button className="button-adress" onClick={handleOpenModal}>
        {loading ? <Skeleton width={100} height={20} /> : 'Схема проезда'}
      </button>
    </div>
    <SearchInput />
    <div className="call-container">
      {loading ? (
        <Skeleton height={20} width={100} />
      ) : (
        <>
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="svg "
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            ></path>
          </svg>
          <div>
            <h4 className="">8(961)5259191</h4>
            <button className="button-call" onClick={openCallDialog}>
              Заказать звонок
            </button>

          </div>
        </>
      )}

    </div>
    <div className="container-entryDialog ">

      <button type="button" className="button-openEntryDialog" onClick={openEntryDialog}>
        {loading ? (
          <div className="round-skeleton"></div>

        ) : (
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="svg "
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            ></path>
          </svg>
        )}
        <p className="underline-animation">{loading ? <Skeleton width={50} /> : "Войти"}</p>

      </button>

      <Link href="FavoritePage" className="link-favoritePage">
        {loading ? (
          <div className="round-skeleton"></div>

        ) : (
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="svg "
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            ></path>
          </svg>
        )}
        <p className="underline-animation">{loading ? <Skeleton width={50} /> : "Избранное"}</p>
      </Link>
      <div>
        <button type="button" className="button-basket" onClick={handleOpenDrower}>
          {loading ? (
            <div className="round-skeleton"></div>

          ) : (
            <svg
              data-slot="icon"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="svg "
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              ></path>
            </svg>
          )}
          <p className="underline-animation ">{loading ? <Skeleton width={50} /> : "Корзина"}</p>
          <span className="header-count">
            {count} {/* Отображаем количество товаров в корзине */}
          </span>
        </button>
      </div>
    </div>

    <Modal isOpen={isModalOpen} onClose={handleCloseModal}isDarkMode={isDarkMode} /> {/* Добавляем модальное окно */}
    <ModalCall isOpen={isCallModalOpen} onClose={closeCallDialog}setNewForm={handleSetNewForm} />{/* Добавляем модальное окно */}
    <ModalEntry show={isEntryModalOpen} onClose={closeEntryDialog}setNewForm={handleSetNewForm} />{/* Добавляем модальное окно */}
    <Drawer isOpen={isDrowerOpen} onClose={handleCloseDrower} isDarkMode={isDarkMode} titleDrawer="корзина">
      <p>Добвленные товары</p>
    </Drawer>{/* Добавляем корзину товаров */}
  </div>);
}

export default Header;

