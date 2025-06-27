import React, { useRef, useEffect, useState } from "react";
import Alert from "../Alert/Alert";
import useForm,{InitialState} from "@/hooks/useForm";
import Input from "../Input/Input";
import Button from "../Button/Button";
import styles from "./ModalCall.module.css"

/**
 * Модальное окно для заказа звонка.
 *
 * Этот компонент отображает модальное окно, где пользователь может оставить свои контактные данные для обратного звонка.
 *
 * @component
 * @param {boolean} isOpen - Определяет, открыто ли модальное окно.
 * @param {function} onClose - Функция, вызываемая для закрытия модального окна.
 * @param {function} setNewForm - Функция для обновления состояния формы после успешной отправки.
 *
 * @example
 * const [isModalOpen, setModalOpen] = useState(false);
 * const handleNewForm = (data) => {
 *   console.log('Новая форма:', data);
 * };
 * 
 * return (
 *   <>
 *     <button onClick={() => setModalOpen(true)}>Открыть модальное окно</button>
 *     <ModalCall isOpen={isModalOpen} onClose={() => setModalOpen(false)} setNewForm={handleNewForm} />
 *   </>
 * );
 */

interface ModalCallProps {
    isOpen:boolean
    onClose:()=>void
    setNewForm:(value:boolean)=> void
}
type Variant = 'positive' | 'negative'; // пример типа Variant
const ModalCall: React.FC<ModalCallProps> = ({ isOpen, onClose, setNewForm }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isShowAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<Variant>('positive');

  const onFormSubmit = (data: InitialState) => {
    console.log('Форма отправлена', data);
    setNewForm(false);
  };

  const { formData, errors, handleChange, handleSubmit, resetForm } = useForm(
    {
      name: "",
      phone: "",
    },
    onFormSubmit
  );

  // Управление открытием/закрытием диалога
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
        resetForm();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, resetForm]);

  // Обработчик закрытия по кнопке "крестик"
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Обработка сабмита формы
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isSuccess = await handleSubmit(e);

    if (isSuccess) {
      localStorage.setItem("userData", JSON.stringify(formData));
      setAlertMessage("Вам перезвонят в течении 30 минут");
      setAlertVariant('positive');
      setShowAlert(true);
      resetForm();

      setTimeout(() => {
        setShowAlert(false);
        onClose();
      }, 3000);
    } else {
      setAlertMessage("Данные введены не корректно.");
      setAlertVariant('negative');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles['modalCall-bg']}>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={e => {
    // Если клик был по самому dialog (фону), закрываем
    if (e.target === dialogRef.current) {
      resetForm();
      onClose();
    }
  }}
      >
        <form onSubmit={handleFormSubmit} method="dialog">
          <div className={styles['modalCall-frame']}>
            <div className={styles['modalCall-header']}>
              <h3 className={styles['modalCall-title']}>Заказать звонок</h3>
              <button
                type="button"
                onClick={handleClose}
                className={styles['button-close']}
                aria-label="Закрыть модальное окно"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles['button-closeSvg']}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className={styles['modalCall-largeContainer']}></div>

            <div className={styles['modalCall-containerMiddle']}>
              <div className={styles['modalCall-containerSmall']}>
                <svg
                  data-slot="icon"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles['container-svg']}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  ></path>
                </svg>
                <h4>8(961)5259191</h4>
              </div>

              <Input
                className={errors.name ? styles['border-red-500'] : ""}
                label="Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
              />

              <Input
                className={errors.phone ? styles['border-red-500'] : ""}
                label="Телефон"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
              />

              <Button type="submit" variant="secondary">
                Отправить
              </Button>

              {isShowAlert && (
                <Alert variant={alertVariant} isOpen={isShowAlert} onClose={handleCloseAlert}>
                  {alertMessage}
                </Alert>
              )}

              <p className={styles['modalCall-text']}>
                Отправляя форму, я даю свое согласие на обработку моих персональных данных.
              </p>
            </div>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default ModalCall;