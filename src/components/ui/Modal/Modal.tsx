import React from 'react';
import Image from "next/image";

import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  isDarkMode:boolean;
  onClose: () => void;
  
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {


  if (!isOpen) return null;

  return (
    <div
      className={`${styles['modal-bg']} }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`${styles['modal-frame']} `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Схема проезда</h2>
          <button onClick={onClose} className={styles['modal-button']} aria-label="Закрыть модальное окно">
            <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles['modal-container']}>
          <p className={styles['modal-address']}>
            Краснодар,<br /> Московская 144 <br />корпус-1 <br />+7 961-525-91-91
          </p>
          <Image
            src="/images/route.jpg"
            width={808}
            height={100}
            alt="map"
            priority
            className={styles["modal-img"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
