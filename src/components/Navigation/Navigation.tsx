import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoading } from '@/context/LoadingContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './Navigation.module.css';

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
  { name: 'Главная', path: '/' },
  { name: 'Акции', path: '/actions' },
  { name: 'Сборка', path: '/assembling' },
  { name: 'Оплата', path: '/payment' },
  { name: 'Доставка', path: '/delivery' },
  { name: 'Наши работы', path: '/work' },
  { name: 'Контакты', path: '/contacts' },
];

const Navigation: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { loading, setLoading } = useLoading();
  const [activeLink, setActiveLink] = useState<string>('Главная');
  const router = useRouter();

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find((item) => item.path === currentPath);
    if (activeItem) {
      setActiveLink(activeItem.name);
    }
  }, [router.pathname]);
//функция для перехода по ссылкам
  const onClickHandler = (link: string, path: string) => {
    if (link !== activeLink) {
      setLoading(true);
      router.push(path).then(() => {
        setLoading(false);
      }).catch((error)=> {
        console.error('Ошибка навигации',error);
        setLoading(false);
      })
      setActiveLink(link);
    }
  };

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.bgDark : styles.bgLight}`}>
      <div className={styles.container}>
        {/* Левая часть меню */}
        <nav className={styles.nav}>
           <div className={styles.navInternal}>
          {loading ? (
            Array(5)
              .fill(null)
              .map((_, index) => <Skeleton key={index} width={100} height={20} />)
          ) : (
            navItems.slice(0, 5).map((item) => {
              const isActive = item.name === activeLink;
              return (
                <a
                  key={item.path}
                  onClick={() => onClickHandler(item.name, item.path)}
                  className={`${styles.navLink} ${styles.relative} ${styles.cursorPointer} 
                  ${styles.underlineAnimation} ${isActive ? `${styles.textSky500}
                   ${styles.active}` : styles.textGray800
                    }`}
                  tabIndex={0}
                >
                  {item.name}
                </a>
              );
            })
          )}
          </div>
        </nav>

        {/* Правая часть меню */}
        <nav className={styles.nav}>
          {loading ? (
            Array(2)
              .fill(null)
              .map((_, index) => <Skeleton key={index} width={80} height={20} />)
          ) : (
            navItems.slice(5).map((item) => {
              const isActive = item.name === activeLink;
              return (
                <a
                  key={item.path}
                  onClick={() => onClickHandler(item.name, item.path)}
                  className={`${styles.navLink} ${styles.relative} ${styles.cursorPointer}
                   ${styles.underlineAnimation}
                    ${isActive ? `${styles.textSky500} ${styles.active}` : styles.textGray800
                    }`}
                  tabIndex={0}
                >
                  {item.name}
                </a>
              );
            })
          )}

          {/* Переключатель темы */}
          <fieldset className={styles.themeToggleFieldset}>
            <input
              type="checkbox"
              id="theme-toggle"
              checked={isDarkMode}
              onChange={toggleTheme}
              className={styles.themeToggleInput}
              aria-label="Переключить тему"
            />
            <label htmlFor="theme-toggle" className={styles.themeToggleLabel}>
              <span className={isDarkMode ? styles.toggleThumbDark : styles.toggleThumbLight} />
            </label>
          </fieldset>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
