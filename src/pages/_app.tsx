//_app.tsx
import "@/styles/globals.css";
import React, { useEffect, useState } from 'react';
import type { AppProps } from "next/app";
import MainLayout from "@/Layouts/MainLayout";
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext'; 
import { LoadingProvider } from '@/context/LoadingContext';
import MenuBar from "@/components/ui/MenuBar/MenuBar";
import { Provider } from "@/components/ui/provider"
import catalogueStore from '@/store/CatalogueStore';
import { useRouter } from "next/router"

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [isDrowerOpen, setIsDrowerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        if (isDrowerOpen) return; // не грузим каталог, если корзина открыта

        const pathSegments = router.asPath.split("/").filter(Boolean);
        const categoryKey = pathSegments[1] || 'kitchen';

        try {
            await catalogueStore.initializeBasket(); // Ждем инициализации корзины
            await catalogueStore.loadInitialData(categoryKey); // Загружаем данные
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    loadData();
}, [router.asPath, isDrowerOpen]);

  const handleOpenDrower = () => setIsDrowerOpen(true);
  const handleCloseDrower = () => {
  console.log("handleCloseDrower вызван");
  setIsDrowerOpen(false);
};


  return (
    <LoadingProvider>
      <ThemeProvider>
        <Provider>
          <CartProvider>
            <MainLayout 
              isDrowerOpen={isDrowerOpen} 
              onOpenDrower={handleOpenDrower} 
              onCloseDrower={handleCloseDrower}
            >
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
