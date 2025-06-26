import React from "react";
import clsx from 'clsx';
import styles from  "./Input.module.css";

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
}) => {
//   const inputClasses = `input-field ${className || ""}`;
const inputClasses = clsx(
  'input-field',
  { 'input-disabled': disabled },
  className
);

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

  return (
    <div className={styles["input-container"]}>
      <label className={styles["input-label"]} htmlFor={name}>
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
      />
      {error && <span className={styles["error-message"]}>{error}</span>}
    </div>
  );
};

export default Input;
