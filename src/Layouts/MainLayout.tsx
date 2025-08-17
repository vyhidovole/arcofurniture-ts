
import React, { ReactNode } from "react";
import Navigation from "@/components/Navigation/Navigation";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
  isDrowerOpen: boolean;
  onOpenDrower: () => void;
  onCloseDrower: () => void;
}

/**
 * Обертка контента основной страницы.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children, isDrowerOpen, onOpenDrower, onCloseDrower }) => {
  return (
    <main>
      <Navigation />
      <Header 
        isDrowerOpen={isDrowerOpen} 
        onOpenDrower={onOpenDrower} 
        onCloseDrower={onCloseDrower} 
      />
      <div className={styles.container}>{children}</div>
      <Footer />
    </main>
  );
};

export default MainLayout;
