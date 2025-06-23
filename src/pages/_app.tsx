import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "@/Layouts/MainLayout";
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext'; 
import { LoadingProvider } from '@/context/LoadingContext';

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
  return (
    <LoadingProvider>
      <ThemeProvider>
        <CartProvider>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </CartProvider>
      </ThemeProvider>
    </LoadingProvider>
  );
};

export default App;
