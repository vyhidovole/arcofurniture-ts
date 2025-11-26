
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

/**
  * Хук для использования контекста темы.
  * @returns {ThemeContextType} Объект с текущим состоянием темы и методом переключения.
  * @throws {Error} Если вызван вне компонента с ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
