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
  variant = "neutral",
  children,
  isOpen,
}) => {
  const [isShowAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setShowAlert(isOpen);
  }, [isOpen]);

  if (!isOpen) return null;

  const iconVariant: Record<Exclude<Variant, "neutral">, React.ReactNode> = {
    info: <FaInfoCircle className="alert-icon" />,
    positive: <FaCheckCircle className="alert-icon" />,
    notice: <FaExclamationCircle className="alert-icon" />,
    negative: <FaTimesCircle className="alert-icon" />,
  };

  return (
    isShowAlert && (
      <div
        className={`alert alert-${variant}`}
        role="alert" 
        aria-live="assertive"
        aria-atomic="true"
      >
        {/* Классы для стилизации алерта, например alert-info, alert-positive и т.д. */}
        {/*"alert" Атрибут для доступности: сообщает, что это важное сообщение (alert) */}
        {/**"assertive" Указывает, что содержимое должно быть немедленно озвучено средствами чтения с экрана */}
        {/** "true"Гарантирует, что всё содержимое будет прочитано целиком, а не частями*/}

        <div className={styles["alert-icon-wrapper"]}>
          {/* Для neutral иконки нет */}
          {variant !== "neutral" && iconVariant[variant]}
          {/* Если variant не "neutral", показываем соответствующую иконку из объекта iconVariant по ключу variant */}
        </div>
        <div className={styles["alert-content"]}>{children}</div>
      </div>
    )
  );
};

export default Alert;
