import React, { useState } from "react";
import Link from "next/link";
import Alert from "../Alert/Alert";
import useForm from "@/hooks/useForm";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useTheme } from "@/context/ThemeContext";
import styles from './ModalPrivetOffice.module.css';
/**
 *  Окно для регистрации пользователя в Личном кабинете.
 *
 * Этот компонент отображает модальное окно, где пользователь может ввести свои данные для регистрации.
 *
 * @component
 * @param {function} setNewState - Функция, вызываемая для обновления состояния после успешной отправки формы.
 *
 * @example
 * const handleNewState = (data) => {
 *   console.log('Новое состояние:', data);
 * };
 * 
 * return (
 *   <ModalPrivetOffice setNewState={handleNewState} />
 * );
 */
interface ModalPrivetOfficeProps {
    variant: 'default'|'positive' | 'negative'; // пример типа Variant
    setNewState: (data: InitialState) => void
}
// Определите тип InitialState, если он еще не определен
interface InitialState {
  name: string;
  email: string;
  password: string;
}
const ModalPrivetOffice: React.FC<ModalPrivetOfficeProps> = ({ setNewState }) => {
    const{isDarkMode} = useTheme()
    const { formData, errors, handleChange, handleSubmit, resetForm } = useForm({
        name: "",
        email: "",
        password: "",
    }, setNewState);

    const [isShowAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState<'positive' | 'negative'| 'info'>('info'); // Установите начальное значение
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        const isSuccess = await handleSubmit(e);

        if (isSuccess) {
            localStorage.setItem('userData', JSON.stringify(formData));
            setShowAlert(true);
            resetForm();
            setAlertMessage("Регистрация прошла успешно.");
            setAlertVariant('positive');
        } else {
            setAlertMessage("Данные введены некорректно.");
            setAlertVariant('negative');
        }

        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
        setIsLoading(false);
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

      return (
        <form onSubmit={handleFormSubmit} method="dialog"className={styles.formContainer}>
            <div className={`${styles.modalContainer} ${isDarkMode ? 'bg-dark': 'bg-light'}`}>
                <div className={styles.modalHeader}>
                     <h1 className={`${styles.title} ${isDarkMode ? 'bg-dark': 'bg-light'}`}>Войти</h1>
                </div>
                <div className={styles.inputGroup}>
                <Input
                    className={`${errors.name ? styles.inputError : ""} ${styles.input}`}
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />
                </div>
                <div className={styles.inputGroup}>
                <Input
                    className={`${errors.email ? styles.inputError : ""} ${styles.input}`}
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                </div>
                <div className={styles.inputGroup}>
                <Input
                    className={`${errors.password ? styles.inputError : ""} ${styles.input}`}
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                </div>
                <Link href="/forgot-password" className={styles.link}>
                    <p className={`${`${styles['forgot-password']}`} ${isDarkMode ? 'bg-dark':'bg-lght'}`}>Забыли пароль?</p>
                </Link>
                <Button
                    type="submit"
                    variant="secondary"
                    className={styles.button}
                    isLoading={isLoading}
                >
                    Отправить
                </Button>
                <div className={styles.footer}>
                    <p className={styles.footerText}>Нет аккаунта?</p>
                    <Link href="/account-page" className={styles.createAccount}>
                        Создать
                    </Link>
                </div>
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
    );
};



export default ModalPrivetOffice;