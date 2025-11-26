import React, { useRef, useEffect, useState } from "react";
import { useTheme } from '@/context/ThemeContext';
import Link from "next/link";
import Alert, { Variant } from "../Alert/Alert";
import useForm, { InitialState } from "@/hooks/useForm";
import Input from "../Input/Input";
import Button from "../Button/Button"
import styles from "./ModalEntry.module.css"

/**
 * Модальное окно для входа пользователя.
 *
 * Этот компонент отображает модальное окно, где пользователь может ввести свои данные для входа.
 *
 * @component
 * @param {boolean} show - Определяет, открыто ли модальное окно.
 * @param {function} onClose - Функция, вызываемая для закрытия модального окна.
 * @param {function} setNewForm - Функция, вызываемая для обновления состояния формы после успешной отправки.
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
 *     <ModalEntry show={isModalOpen} onClose={() => setModalOpen(false)} setNewForm={handleNewForm} />
 *   </>
 * );
 */

interface ModalEntryProps {
    show: boolean
    onClose: () => void
    setNewForm: (value: boolean) => void
}
const ModalEntry: React.FC<ModalEntryProps> = ({ show, onClose, setNewForm }) => {
    const onFormSubmit = (data: Partial<InitialState>) => {
        console.log('Форма отправлена', data)
        setNewForm(false)// говорит родительскому компоненту (через переданный prop-функцию 'setNewState'в хуке), что форму больше не нужно показывать (например, закрывает модальное окно с формой)
    }
    const { isDarkMode } = useTheme(); // Получаем доступ к теме
    const { formData, errors, handleChange, handleSubmit, resetForm } = useForm(
        {
            name: "",
            email: "",
            password: "",
        },
        onFormSubmit
    );


    const dialogRef = useRef<HTMLDialogElement>(null);
    const [isShowAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState<Variant>('info');
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

    useEffect(() => {
        // Обработчик для клика по документу (нужно для закрытия модального окна при клике вне диалога)
        const handleDocumentClick = (e: MouseEvent) => {
            if (
                dialogRef.current && // Проверяем, что диалог существует
                e.target instanceof Node && // Убеждаемся, что target — DOM-узел
                !dialogRef.current.contains(e.target) // Проверяем, что клик НЕ внутри диалога
            ) {
                resetForm()
                onClose()
            }
        }
        if (dialogRef.current) {
            if (show && !dialogRef.current.open) {
                dialogRef.current.show();
                document.addEventListener('pointerdown', handleDocumentClick);
            } else if (!show && dialogRef.current.open) {
                dialogRef.current.close();
                document.removeEventListener('pointerdown', handleDocumentClick);
            }
        }
        return () => {
            document.removeEventListener('pointerdown', handleDocumentClick);
        };
    }, [show, resetForm, onClose]);


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Устанавливаем состояние загрузки перед отправкой
        setIsLoading(true);

        // Если нет ошибок, отправляем данные
        const isSuccess = await handleSubmit(e);

        if (isSuccess) {
           
            setAlertMessage("Регистрация прошла успешно.");
            setAlertVariant('positive');
            setShowAlert(true);
            resetForm();

            setTimeout(() => {
                setShowAlert(false);
                onClose();
            }, 3000);
            setIsLoading(false); // Сбрасываем состояние загрузки

        } else {
            // Устанавливаем сообщение и показываем Alert
            setAlertMessage("Данные введены не корректно.");
            setAlertVariant('negative'); // Установите нужный вариант
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
            setIsLoading(false); // Сбрасываем состояние загрузки
            return

        }

    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const isFormValid = Object.keys(errors).length === 0 && formData.name && formData.email && formData.password;//`formData.name && formData.email && formData.password` — Все поля (имя, email и пароль) должны быть заполнены (не пустые строки или null).


    if (!show) return null;

    return (
        <div
            className={`${styles['modalEntry-overlay']} ${show ? styles.block : styles.hidden}`}

        >
            <dialog ref={dialogRef} className={styles.dialogEntry}>
                <form onSubmit={handleFormSubmit} method="dialog">
                    <div
                        className={`${styles['modalEntry-frame']} ${isDarkMode ? styles.dark : styles.light}`}
                        onClick={(e) => e.stopPropagation()} // Останавливаем всплытие клика на модалке
                    >
                        {/* Заголовок Модального окна */}
                        <div className={styles["modalEntry-header"]}>
                            <h1 className={styles["modalEntry-title"]}>Войти</h1>
                        </div>

                        {/* Содержание Модального окна */}
                        <Input
                            className={errors.name ? styles["border-red"] : ""}
                            label="Name"
                            type="text"
                            name="name"
                            value={formData.name ?? ''}
                            onChange={handleChange}
                            error={errors.name ?? ''}
                        />

                        <Input
                            className={errors.email ? styles["border-red"] : ""}
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email ?? ''}
                            onChange={handleChange}
                            error={errors.email ?? ''}
                        />

                        <Input
                            className={errors.password ? styles["border-red"] : ""}
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password ?? ''}
                            onChange={handleChange}
                            error={errors.password ?? ''}
                        />
                        <Link href="/forgot-password" className={styles.linkPassword} onClick={onClose}>
                            <p>Забыли пароль?</p>
                        </Link>

                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={!isFormValid} // Делаем кнопку недоступной, если форма не валидна
                            isLoading={isLoading} // Передаём состояние загрузки
                            className={styles.button}
                        >
                            Отправить
                        </Button>

                        {isShowAlert && (
                            <Alert
                                variant={alertVariant}
                                isOpen={isShowAlert}
                                onClose={handleCloseAlert}
                            >
                                {alertMessage}
                            </Alert>
                        )}

                    </div>
                </form>
            </dialog>
        </div>
    );
};

export default ModalEntry;
