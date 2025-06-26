import React from "react";
import { CiMenuBurger } from "react-icons/ci"
import styles from "./BurgerButton.module.css";
/**
 * Компонент кнопки бургера для мобильного меню.
 *
 * Этот компонент отображает кнопку с иконкой бургера и текстом "Меню".
 * Кнопка скрыта на больших экранах и отображается на мобильных устройствах.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {function} props.onClick - Функция, вызываемая при клике на кнопку.
 * @returns {JSX.Element} Элемент кнопки бургера.
 *
 * @example
 * const handleMenuToggle = () => {
 *     console.log("Меню открыто!");
 * };
 *
 * return <BurgerButton onClick={handleMenuToggle} />;
 */
type BurgerButtonProps = {
    onClick:()=>void
}
const BurgerButton:React.FC<BurgerButtonProps> = ({ onClick }) => {

  return (

    <button className={styles["burger-button"]} onClick={onClick}>
      <CiMenuBurger />
      <p>Меню</p>
    </button>
  );
};

export default BurgerButton;
