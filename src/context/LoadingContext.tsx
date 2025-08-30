import React,{ createContext, ReactNode, ReactElement, useContext, useState, Dispatch, SetStateAction } from 'react';


/**
 * Тип контекста загрузки.
 * @typedef {Object} LoadingContextType
 * @property {boolean} loading - Состояние загрузки.
 * @property {Dispatch<SetStateAction<boolean>>} setLoading - Функция для установки состояния загрузки.
 */
type LoadingContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

/**
 * Контекст загрузки.
 * Предоставляет состояние загрузки и функцию для его изменения.
 */
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

/**
 * Тип пропсов провайдера загрузки.
 * @typedef {Object} LoadingProviderProps
 * @property {ReactNode} children - Дочерние компоненты.
 */
type LoadingProviderProps = {
  children: ReactNode;
};

/**
 * Провайдер контекста загрузки.
 * Оборачивает дочерние компоненты и предоставляет им доступ к состоянию загрузки.
 *
 * @param {LoadingProviderProps} props - Пропсы компонента.
 * @param {ReactNode} props.children - Дочерние компоненты.
 * @returns {ReactElement} Провайдер с контекстом загрузки.
 *
 * @example
 * <LoadingProvider>
 *   <MyComponent />
 * </LoadingProvider>
 */
export const LoadingProvider = ({
  children,
}: LoadingProviderProps): ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

/**
 * Хук для доступа к состоянию загрузки и функции его изменения.
 *
 * @throws {Error} Если хук используется вне компонента LoadingProvider.
 * @returns {LoadingContextType} Объект с состоянием загрузки и функцией установки.
 *
 * @example
 * const { loading, setLoading } = useLoading();
 */
export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
