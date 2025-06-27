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
    info: <FaInfoCircle className={styles["alert-icon"]} />,
    positive: <FaCheckCircle className={styles["alert-icon"]} />,
    notice: <FaExclamationCircle className={styles["alert-icon"]} />,
    negative: <FaTimesCircle className={styles["alert-icon"]} />,
  };

  // Получаем класс варианта из CSS-модуля
  const variantClass = styles[`alert-${variant}` as keyof typeof styles] || "";

  return (
    isShowAlert && (
      <div
        className={`${styles.alert} ${variantClass}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className={styles["alert-icon-wrapper"]}>
          {variant !== "neutral" && iconVariant[variant]}
        </div>
        <div className={styles["alert-content"]}>{children}</div>
      </div>
    )
  );
};

export default Alert;
