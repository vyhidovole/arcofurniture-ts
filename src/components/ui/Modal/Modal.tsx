import React, { useEffect } from 'react';
import Image from "next/image";
import { useTheme } from '@/context/ThemeContext';
import  '@/components/Modal/Modal.module.css'; 
/**
 * Модальное окно для отображения схемы проезда.
 *
 * Этот компонент отображает модальное окно с информацией о местоположении и изображением схемы проезда.
 *
 * @component
 * @param {boolean} isOpen - Определяет, открыто ли модальное окно.
 * @param {function} onClose - Функция, вызываемая для закрытия модального окна.
 * @param {boolean} isDarkMode - Определяет тему.
 * 
 
 */
export interface ModalProps {
    isOpen: boolean;
    isDarkMode:boolean;
    onClose: ()=> void;

}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
   const { isDarkMode } = useTheme(); // Получаем доступ к теме
   


useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest('.modal-bg')) {
    onClose();
  }
};

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, [onClose]);
if (!isOpen) return null; // Если модальное окно закрыто, ничего не рендерим

  return (
    <div className={`modal-bg ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="modal-frame">
        
        {/* Заголовок модального окна */}
        <div className="modal-header">
          <h2 className="modal-title">Схема проезда</h2>
          <button onClick={onClose} className="modal-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className='modal-container'>
          <h2>
            Краснодар,<br/> Московская 144 <br />корпуc-1 <br />+7 961-525-91-91
          </h2>
          {/* Добавляем изображение */}
          <Image
            src={"/images/route.jpg"}
            width={808} height={100}
            alt="map"
            priority={true}
            className='object-cover overflow-hidden'
          />
        </div>

      </div>
    </div>
  );
};

export default Modal;
