import React, { useState } from "react"
import useForm from "@/hooks/useForm";
import Link from "next/link";
import Alert from "@/components/ui/Alert/Alert";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { useTheme } from '@/context/ThemeContext'
import clsx from "clsx";
import styles from "./account-page.module.css"

/**
 * Компонент для регистрации пользователя.
 * Позволяет пользователю вводить свои данные для создания аккаунта.
 *
 * @component
 * @param {Function} setNewState - Функция для обновления состояния родительского компонента.
 * @returns {JSX.Element} Элемент, представляющий форму регистрации.
 *
 * @example
 * const handleNewState = (newState) => {
 *   // Обработка нового состояния
 * };
 * 
 * <Account setNewState={handleNewState} />
 */
// Определите тип InitialState, если он еще не определен
interface InitialState {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmation: string
}
interface AccountProps {
    setNewState: (data: Partial<InitialState>) => void
}

const Account: React.FC<AccountProps> = ({ setNewState }) => {
    const { isDarkMode } = useTheme()
    const { formData, errors, handleChange, handleSubmit, resetForm } = useForm(
        { name: '', phone: '', email: "", password: '', confirmation: '' }, setNewState);
// Локальный стейт для ошибок (чтобы избежать мутаций)
    
    const [isShowAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState<'positive' | 'negative' | 'info'>('info');
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки

     

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        setIsLoading(true); // Устанавливаем состояние загрузки
        
        // Вызываем handleSubmit из useForm для отправки данных
        const isSuccess = await handleSubmit(e); // Предполагается, что handleSubmit возвращает true/false

        // Если форма успешно отправлена и нет ошибок

        if (isSuccess) {
            localStorage.setItem('userData', JSON.stringify(formData));

            setShowAlert(true);
            resetForm(); // Сбрасываем форму
            setTimeout(() => {
                setShowAlert(false);
            }, 3000); // Закрываем алерт через 3 секунды
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
        // Устанавливаем сообщение и показываем Alert
        setAlertMessage("Регисрация прошла успешно.");
        setAlertVariant('positive'); // Установите нужный вариант
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
        setIsLoading(false); // Сбрасываем состояние загрузки
    }

    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    return (
        <>
            <h2 className={styles.title}>Быстрая регистрация</h2>
            <div className={styles.linkContainer}>
                <Link href="/" className={styles.link}>Главная</Link>
                -
                <p className={styles.text}>Быстрая регистрация</p>
            </div>
            <Alert
                isOpen={isShowAlert}
                onClose={handleCloseAlert}
                variant={alertVariant}
            >
                {alertMessage}
            </Alert>
            <form
                onSubmit={handleFormSubmit}
                method="dialog"
                className={`${styles.form} ${isDarkMode ? 'bg-dark' : 'bg-light'}`}>
                <div className={clsx(styles.inputContainer, { [styles.inputError]: errors.name })}>
                    <Input
                        label="Имя"
                        type="text"
                        name="name"
                        value={formData.name ?? ''}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </div>
                <div className={clsx(styles.inputContainer, { [styles.inputError]: errors.phone })}>
                    <Input
                        label="Телефон"
                        type="tel"
                        name="phone"
                        value={formData.phone ?? ''}
                        onChange={handleChange}
                        error={errors.phone}
                    />
                </div>
                <div className={clsx(styles.inputContainer, { [styles.inputError]: errors.email })}>
                    <Input

                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email ?? ''}
                        onChange={handleChange}
                        error={errors.email}
                    />
                </div>
                <div className={clsx(styles.inputContainer, { [styles.inputError]: errors.password })}>
                    <Input

                        label="Пароль"
                        type="password"
                        name="password"
                        value={formData.password ?? ''}
                        onChange={handleChange}
                        error={errors.password}
                    />
                </div>
                <div className={clsx(styles.inputContainer, { [styles.inputError]: errors.confirmation })}>
                    <Input

                        label="Подтверждение"
                        type="password"
                        name="confirmation"
                        value={formData.confirmation ?? ''}
                        onChange={handleChange}
                        error={errors.confirmation}
                    />
                </div>

                <Button
                    type="submit"
                    variant="secondary"
                    isLoading={isLoading}
                    className={styles.button}
                >
                    Отправить
                </Button>
            </form>
        </>
    );
}

export default Account;

