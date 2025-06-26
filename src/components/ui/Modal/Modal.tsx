import React, { useEffect,useRef  } from 'react';
import Image from "next/image";
import { useTheme } from '@/context/ThemeContext';
import styles from './Modal.module.css'; 
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
   const dialogRef = useRef<HTMLDialogElement>(null);


 useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dialog && !dialog.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
if (!isOpen) return null; // Если модальное окно закрыто, ничего не рендерим

   return (
    <div
      className={`${styles['modal-bg']} ${isDarkMode ? styles['dark-mode'] : styles['light-mode']}`}
      // Клик по фону тоже закрывает
      onClick={(e) => {
        // Если кликнули именно по фону (не по диалогу)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <dialog
        ref={dialogRef}
        className={styles['modal-frame']}
        onClick={e => e.stopPropagation()} // Остановить всплытие, чтобы клик внутри не закрыл модалку
      >
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Схема проезда</h2>
          <button onClick={onClose} className={styles['modal-button']} aria-label="Закрыть модальное окно">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles['modal-container']}>
          <h2>
            Краснодар,<br /> Московская 144 <br />корпус-1 <br />+7 961-525-91-91
          </h2>
          <Image
            src="/images/route.jpg"
            width={808}
            height={100}
            alt="map"
            priority
            className="object-cover overflow-hidden"
          />
        </div>
      </dialog>
    </div>
  );
};


export default Modal;
