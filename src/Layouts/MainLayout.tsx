import React, { ReactNode } from "react";
import Navigation from "@/components/Navigation/Navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer"
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Обертка контента основной страницы.
 * Этот компонент служит контейнером для навигации, заголовка, основного контента и подвала.
 *
 * @component
 * @param {MainLayoutProps} props - Свойства компонента.
 * @param {React.ReactNode} props.children - Дочерние компоненты, которые будут отображаться в основном контенте.
 * @returns {JSX.Element} Элемент, представляющий основную разметку страницы.
 *
 * @example
 * <MainLayout>
 *   <YourContentComponent />
 * </MainLayout>
 */

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <main>
      <Navigation />
      <Header />
      <div className={styles.container}>{children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
