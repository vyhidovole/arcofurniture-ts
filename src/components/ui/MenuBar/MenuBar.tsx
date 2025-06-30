import React, { useEffect } from "react";
import Link from "next/link";
import { useLoading } from '@/context/LoadingContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import DropdownCupboard from "@/components/ui/Dropdown/DropdownCupboard";
import DropdownLiving from "@/components/ui/Dropdown/DropdownLiving";
import DropdownBaby from"@/components/ui/Dropdown/DropdownBaby";
import DropdownBedroom from "@/components/ui/Dropdown/DropdownBedroom";
import DropdownCouch from "@/components/ui/Dropdown/DropdownCouch";
import DropdownLobby from "@/components/ui/Dropdown/DropdownLobby";
import styles from './MenuBar.module.css'

/**
 * Компонент MenuBar отображает меню навигации с выпадающими списками.
 * Он использует контекст загрузки для отображения индикатора загрузки
 * во время получения данных.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий меню навигации.
 *
 * @example
 * <MenuBar />
 */

const MenuBar = () => {
  const { loading, setLoading } = useLoading(); // Получаем состояние загрузки

  // Пример эффекта для имитации загрузки данных
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Имитация задержки для загрузки данных
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 секунды
      setLoading(false);
    };

    fetchData();
  }, [setLoading]);

  return (
    <div className={styles["menuBar-mainContainer"]}>
        {loading ? (
            // Если данные загружаются, показываем скелетон для всего контейнера
            <Skeleton height={56} width="100%" />
        ) : (
            // Если данные загружены, показываем компоненты Dropdown
            <div className={styles["menuBar-container"]}>
                <Dropdown />
                <DropdownLiving />
                <DropdownBaby />
                <DropdownBedroom />
                <DropdownCouch />
                <DropdownLobby />
                <DropdownCupboard />
                <Link href="/" className={styles["menuBar-link"]}>каталог</Link>
               </div>
        )}
    </div>
);
};


export default MenuBar;