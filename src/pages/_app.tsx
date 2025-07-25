// import "@/styles/globals.css";
// import React, { useEffect } from 'react';
// import type { AppProps } from "next/app";
// import MainLayout from "@/Layouts/MainLayout";
// import { CartProvider } from '@/context/CartContext';
// import { ThemeProvider } from '@/context/ThemeContext'; 
// import { LoadingProvider } from '@/context/LoadingContext';
// import MenuBar from "@/components/ui/MenuBar/MenuBar";
// import { Provider } from "@/components/ui/provider"
// import catalogueStore from '@/store/CatalogueStore';
// import { useRouter } from "next/router"

// /**
//  * Корневой элемент страницы.
//  * Этот компонент оборачивает все страницы приложения в необходимые провайдеры
//  * и предоставляет общий макет для всех страниц.
//  *
//  * @component
//  * @param {AppProps} props - Свойства компонента.
//  * @returns {JSX.Element} Элемент, представляющий корневой компонент приложения.
//  *
//  * @example
//  * <App Component={MyPage} pageProps={myPageProps} />
//  */
// const App = ({ Component, pageProps }: AppProps) => {
//    const router = useRouter();
 
//   useEffect(() => {
//     // Получаем ключ категории из пути
//     // Например, если URL /kitchen или /drawingroom, берем первый сегмент пути
//     const pathSegments = router.asPath.split("/").filter(Boolean);
//     const categoryKey = pathSegments[0] || "all"; // если пусто — all

//     catalogueStore.loadInitialData(categoryKey).catch(console.error);
//   }, [router.asPath]);
//   return (
//     <LoadingProvider>
//       <ThemeProvider>
//         <Provider>
//           <CartProvider>
//           <MainLayout>
//              <MenuBar />
//             <Component {...pageProps} />
//           </MainLayout>
//         </CartProvider>
//         </Provider>
//          </ThemeProvider>
//     </LoadingProvider>
//   );
// };

// export default App;
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
    if (isDrowerOpen) return; // не грузим каталог, если корзина открыта

    const pathSegments = router.asPath.split("/").filter(Boolean);
    const categoryKey = pathSegments[0] || "all";

    catalogueStore.loadInitialData(categoryKey).catch(console.error);
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
