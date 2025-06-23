
import React, { createContext, useContext, useState, ReactNode } from 'react';
/**
 * Тип данных для контекста темы.
 * @property {boolean} isDarkMode - Текущий режим темы: dark или light.
 * @property {() => void} toggleTheme - Функция для переключения темы.
 */
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};
/**
 * Создаем контекст темы.
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
/**
 * Свойства компонента ThemeProvider.
 * @property {ReactNode} children - Дочерние компоненты.
 */
type ThemeProviderProps = {
  children: ReactNode;
};
/**
 * Провайдер контекста темы.
 * Оборачивает дочерние компоненты и управляет состоянием темы.
 * @param {ThemeProviderProps} props - Свойства компонента.
 * @returns {JSX.Element} Компонент провайдера.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
/**
   * Переключает режим темы между светлой и темной.
   */
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
 /**
   * Значение для контекста.
   */
  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
/**
 * Хук для использования контекста темы.
 * @returns {ThemeContextType} Объект с текущим состоянием темы и методом переключения.
 * @throws {Error} Если вызван вне компонента с ThemeProvider.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
