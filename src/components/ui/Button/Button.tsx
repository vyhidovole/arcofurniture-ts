import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import styles from "./Button.module.css";

type ButtonProps = {
    className?: string
    onClick?: ()=> void
    variant?:"primary"|"secondary"|"nagative"|"ghost"|"link"
    type?:"submit"|"button"|"reset"
    suffix?: React.ReactNode
    icon?: React.ReactNode
    isLoading?: boolean
    children?: React.ReactNode
    disabled?: boolean
}
/**
 * Компонент кнопки
 */
const Button: React.FC<ButtonProps>=({
    className = "",
    onClick,
    variant = "primary",
    type = "submit",
    suffix,
    icon,
    isLoading = false,
    children,
    disabled = false,
}) => {
    //Формируем класс  с учетом стилей из css Modules
    const variantClassName = styles[variant]||""
    const combinedClassName = [
        "my-button",
        variantClassName,
        className,
    ].filter(Boolean).join(" ")//альтернатива clsx и classnames

    return (
        <button className={combinedClassName}
        disabled={disabled||isLoading}
        onClick={onClick}
        type = {type}
        >
            {isLoading?(
                <BiLoaderAlt className={styles["biLoaderAlt"]}/>
            ):(
                <>
                {icon}
                {children}
                {suffix && <span className="ml-2">{suffix}</span>}
                
                </>
            )}

        </button>
    )

}
export default Button;