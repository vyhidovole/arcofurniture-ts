
// import React, { createContext, useContext, useState, ReactNode } from 'react';
// /**
//  * Тип данных для контекста темы.
//  * @property {boolean} isDarkMode - Текущий режим темы: dark или light.
//  * @property {() => void} toggleTheme - Функция для переключения темы.
//  */
// type ThemeContextType = {
//   isDarkMode: boolean;
//   toggleTheme: () => void;
// };
// /**
//  * Создаем контекст темы.
//  */
// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// /**
//  * Свойства компонента ThemeProvider.
//  * @property {ReactNode} children - Дочерние компоненты.
//  */
// type ThemeProviderProps = {
//   children: ReactNode;
// };
// /**
//  * Провайдер контекста темы.
//  * Оборачивает дочерние компоненты и управляет состоянием темы.
//  * @param {ThemeProviderProps} props - Свойства компонента.
//  * @returns {JSX.Element} Компонент провайдера.
//  */
// export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
// /**
//    * Переключает режим темы между светлой и темной.
//    */
//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };
//  /**
//    * Значение для контекста.
//    */
//   const value: ThemeContextType = {
//     isDarkMode,
//     toggleTheme,
//   };

//   return (
//     <ThemeContext.Provider value={value}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
// /**
//  * Хук для использования контекста темы.
//  * @returns {ThemeContextType} Объект с текущим состоянием темы и методом переключения.
//  * @throws {Error} Если вызван вне компонента с ThemeProvider.
//  */
// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Определяем интерфейс для контекста
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Создаем контекст с начальным значением
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // Изначально устанавливаем значение по умолчанию

  useEffect(() => {
    // Проверяем, доступен ли localStorage
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('isDarkMode');
      if (savedMode) {
        setIsDarkMode(JSON.parse(savedMode));
      } else {
        setIsDarkMode(false); // Устанавливаем значение по умолчанию, если нет сохраненного значения
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('isDarkMode', JSON.stringify(newMode));
      }
      return newMode;
    });
  };

  // Если состояние еще не инициализировано, можно вернуть null или загрузочный индикатор
  if (isDarkMode === null) {
    return null; // Или можно вернуть какой-то индикатор загрузки
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Хук для использования контекста
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
