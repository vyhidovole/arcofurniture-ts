
import React, { ReactNode } from "react";
import Navigation from "@/components/Navigation/Navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
}

/**
 * Обертка контента основной страницы.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, isDrawerOpen, onOpenDrawer, onCloseDrawer }) => {
  return (
    <main>
      <Navigation />
      <Header 
        isDrawerOpen={isDrawerOpen} 
        onOpenDrawer={onOpenDrawer} 
        onCloseDrawer={onCloseDrawer} 
      />
      <div className={styles.container}>{children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
