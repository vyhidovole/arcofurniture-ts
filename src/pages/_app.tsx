import "@/styles/globals.css";
import React, { useEffect } from 'react';
import type { AppProps } from "next/app";
import MainLayout from "@/Layouts/MainLayout";
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext'; 
import { LoadingProvider } from '@/context/LoadingContext';
import MenuBar from "@/components/ui/MenuBar/MenuBar";
import { Provider } from "@/components/ui/provider"
import catalogueStore from '@/store/CatalogueStore';


/**
 * Корневой элемент страницы.
 * Этот компонент оборачивает все страницы приложения в необходимые провайдеры
 * и предоставляет общий макет для всех страниц.
 *
 * @component
 * @param {AppProps} props - Свойства компонента.
 * @returns {JSX.Element} Элемент, представляющий корневой компонент приложения.
 *
 * @example
 * <App Component={MyPage} pageProps={myPageProps} />
 */
const App = ({ Component, pageProps }: AppProps) => {
   
  useEffect(() => {
    // Замените 'defaultCategoryKey' на нужный вам ключ категории
    const defaultCategoryKey = 'all';

    catalogueStore.loadInitialData(defaultCategoryKey)
      .catch(error => {
        console.error('Ошибка при загрузке данных каталога:', error);
      });
  }, []);

  useEffect(() => {
    // Замените 'defaultCategoryKey' на нужный вам ключ категории
    const defaultCategoryKey = 'all';

    catalogueStore.loadInitialData(defaultCategoryKey)
      .catch(error => {
        console.error('Ошибка при загрузке данных каталога:', error);
      });
  }, []);
  return (
    <LoadingProvider>
      <ThemeProvider>
        <Provider>
          <CartProvider>
          <MainLayout>
             <MenuBar />
            <Component {...pageProps} />
          </MainLayout>
        </CartProvider>
        </Provider>
         </ThemeProvider>
    </LoadingProvider>
  );
};

export default App;
