import React, { useState, useEffect, ReactNode } from "react";
import {
  FaInfoCircle,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import styles from "./Alert.module.css";

export type Variant = "neutral" | "info" | "positive" | "notice" | "negative";

interface AlertProps {
  variant?: Variant;
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
  variant = "neutral",// Значение по умолчанию - neutral.
  children,
  isOpen,
}) => {
  const [isShowAlert, setShowAlert] = useState(false);
  // useEffect: Запускается при изменении isOpen.
  // Синхронизирует локальное состояние с пропом. Если isOpen=true, алерт показывается.
  useEffect(() => {
    setShowAlert(isOpen); // Просто копирует значение isOpen.
  }, [isOpen]);

  if (!isOpen) return null;
  // Объект iconVariant: Карта иконок для каждого варианта (кроме neutral).
  // Ключ - вариант, значение - JSX-элемент иконки с классом для стилизации.
  // Record<Exclude<Variant, "neutral">, React.ReactNode> означает, что ключи - все варианты кроме "neutral".
  const iconVariant: Record<Exclude<Variant, "neutral">, React.ReactNode> = {
    info: <FaInfoCircle className={styles["alert-icon"]} />,
    positive: <FaCheckCircle className={styles["alert-icon"]} />,
    notice: <FaExclamationCircle className={styles["alert-icon"]} />,
    negative: <FaTimesCircle className={styles["alert-icon"]} />,
  };

  // Получаем класс варианта из CSS-модуля
  // Получение класса варианта: Динамически берёт класс из CSS-модуля (например, styles['alert-info']).
  // Если класса нет, использует пустую строку. Это позволяет стилизовать алерт по варианту.
  const variantClass = styles[`alert-${variant}` as keyof typeof styles] || "";
  // Рендеринг JSX: Условный рендеринг через && (если isShowAlert=true, рендерится).
  // Структура: Обёртка div с классами, иконка (если не neutral), содержимое.
  return (
    isShowAlert && (
      <div
        className={`${styles.alert} ${variantClass}`} // Базовый класс + класс варианта.
        role="alert" // ARIA: Указывает, что это алерт для скрин-ридеров.
        aria-live="assertive" // ARIA: Сообщает об изменениях немедленно (важно для динамического контента).
        aria-atomic="true"  // ARIA: Читает весь алерт целиком при изменении.
      >
        {/* Обёртка для иконки: Показывается только если вариант не neutral. */}
        <div className={styles["alert-icon-wrapper"]}>
          {variant !== "neutral" && iconVariant[variant]} {/*Условный рендеринг иконки */}
        </div>
        <div className={styles["alert-content"]}>{children}</div>
      </div>
    )
  );
};

export default Alert;
