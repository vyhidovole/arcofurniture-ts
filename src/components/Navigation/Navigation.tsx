import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useLoading } from '@/context/LoadingContext';
import { useTheme } from '@/context/ThemeContext';
import styles from '@/components/Navigation/Navigation.module.css';
// Типизация пунктов меню
type NavItem = {
  name: string;
  path: string;
};

// Массив пунктов меню
const navItems: NavItem[] = [
  { name: 'Главная', path: '/' },
  { name: 'Акции', path: '/Actions' },
  { name: 'Сборка', path: '/Assembling' },
  { name: 'Оплата', path: '/Payment' },
  { name: 'Доставка', path: '/Delivery' },
  { name: 'Наши работы', path: '/Work' },
  { name: 'Контакты', path: '/Contacts' },
];

/**
 * Компонент Navigation отображает навигационное меню.
 */
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

  const onClickHandler = (link: string, path: string) => {
    if (link !== activeLink) {
      setLoading(true);
      router.push(path).then(() => {
        setLoading(false);
      });
      setActiveLink(link);
    }
    console.log(activeLink);
  };

  return (
    <header className={`header ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
      <div className={styles.container}>
        {/* Левая часть меню */}
        <nav className={styles.nav}>
          {loading ? (
            Array(5)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} width={100} height={20} />
              ))
          ) : (
            navItems.slice(0, 5).map((item) => (
              <a onClick={() => onClickHandler(item.name, item.path)} // передаем путь
                className={`nav-link  ${item.name === activeLink ? 'text-sky-500 underline-animation' : 'text-gray-800'
                  }`}
                style={{
                  color: item.name === activeLink
                    ? (isDarkMode ? '#89cdd3' : '#0ea5e9')
                    : (isDarkMode ? '#99a0a3' : '#1f2937'),
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '1rem',
                }}

                key={item.path}
              >
                {item.name}
              </a>
            ))
          )}
        </nav>

        {/* Правая часть меню */}
        <nav className={styles.nav}>
          {loading ? (
            Array(2)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} width={80} height={20} />
              ))
          ) : (
            navItems.slice(5).map((item) => (
              // <a
              // className="nav-link underline-animation"
              //   key={item.path}
              //   onClick={() => onClickHandler(item.name, item.path)}
              //   style={{
              //     ...(item.name === activeLink ? { color: '#0ea5e9' } : { color: '#1f2937' }),
              //     cursor: 'pointer',
              //     fontWeight: 500,
              //     fontSize: '1rem',
              //     ...(isDarkMode ? { color: '#99a0a3' } : {}),
              //     // Добавьте другие стили по необходимости
              //   }}
              // >
              //   {item.name}
              // </a>
              <a onClick={() => onClickHandler(item.name, item.path)}
                className={`nav-link relative cursor-pointer ${item.name === activeLink ? 'text-sky-500 underline-animation' : 'text-gray-800'
                  }`}
                key={item.path}
                style={{
                  color: item.name === activeLink ? '#0ea5e9' : '#1f2937',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '1rem',
                  ...(isDarkMode ? { color: '#99a0a3' } : {}),
                }}
              >
                {item.name}
              </a>
            ))
          )}

          {/* Переключатель темы */}
          <fieldset style={{ position: 'relative', width: '4rem', height: '2rem', border: 'transparent' }}>
            <input type="checkbox"
              style={{
                opacity: 0,
                width: 0,
                height: 0,
                position: 'absolute',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
              }}
              id="theme-toggle"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <label
              htmlFor="theme-toggle"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                borderRadius: '9999px',
                cursor: 'pointer',
                backgroundColor: isDarkMode ? '#2563eb' : '#d1d5db',
                transition: 'background-color 0.3s ease',
              }}
            >
              <span style={{
                position: 'absolute',
                top: '0.125rem',
                left: '0.125rem',
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '9999px',
                transition: 'transform 0.3s ease',
                transform: isDarkMode ? 'translateX(2rem)' : 'none',
              }}
              />
            </label>
          </fieldset>
        </nav>
      </div>

    </header>
  );
};

export default Navigation;
