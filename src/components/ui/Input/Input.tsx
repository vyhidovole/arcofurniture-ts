import React,{useState,useEffect} from "react";
import clsx from 'clsx';
import { useTheme } from "@/context/ThemeContext";
import styles from "./Input.module.css";

interface InputProps {
  value: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  readOnly?: boolean;
  placeholder?: string;
  type?: string;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  style?: React.CSSProperties;  // Добавляем пропс для inline стилей
  isSpecial?: boolean;  // Новый проп: true для специального места (20%/50%), false для всего остального (100%)

}

/**
 * Компонент ввода текста.
 * @param {InputProps} props - Свойства компонента.
 * @returns {JSX.Element} - Элемент ввода текста.
 */
const Input: React.FC<InputProps> = ({
  value,
  name,
  required,
  label,
  error,
  disabled,
  autoComplete = "off",
  readOnly,
  placeholder,
  type = "text",
  onClick,
  onChange,
  onInput,
  onBlur,
  onFocus,
  className,
  style,
  isSpecial = false,
}) => {
  const inputClasses = clsx(
    styles.inputField,
    {
      [styles.inputDisabled]: disabled,
      [styles.inputError]: error
    },
    className
  );
  const { isDarkMode } = useTheme()
 
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (onInput) {
      onInput(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(event);
    }
  };


  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Динамическая ширина:
  // - Если isSpecial = true: 20% на больших, 50% на малых (медиа переопределит на 50%)
  // - Иначе: 100%
  const dynamicWidth = isSpecial ? (isMobile ? '50%' : '20%') : '100%';

  const dynamicStyle: React.CSSProperties = {
    width: dynamicWidth,  // Inline-стиль
    // ... другие стили, если нужно ...
  };
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel} htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        onClick={onClick}
        onChange={handleChange}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={inputClasses}
        style={{
          backgroundColor: isDarkMode ? 'rgb(54, 53, 53)' : '#ffffff',
          color: isDarkMode ? 'beige' : '#111827',
          ...style,  ...dynamicStyle // Распространяем переданные стили (например, width: 20%)
        }}
      />
      {error && (
        <span className={styles.errorMessage} title={error}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
