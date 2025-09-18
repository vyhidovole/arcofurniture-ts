import React, { useState, } from "react"
import Link from "next/link";
import useForm from "@/hooks/useForm";
import Alert from "@/components/ui/Alert/Alert";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { useTheme } from "@/context/ThemeContext";
import styles from './forgot-password.module.css'
/**
 * Компонент для восстановления пароля.
 * Позволяет пользователю ввести свой адрес электронной почты для получения нового пароля.
 *
 * @component
 * @param {Function} setNewState - Функция для обновления состояния родительского компонента.
 * @returns {JSX.Element} Элемент, представляющий форму восстановления пароля.
 *
 * @example
 * return <Password setNewState={someFunction} />;
 */
// Определите тип InitialState, если он еще не определен
interface InitialState {
    name: string;
    email: string;
    password: string;

}
interface PasswordProps {
    variant: 'default' | 'positive' | 'negative'; // пример типа Variant
    setNewState: (data:Partial <InitialState>) => void
}

const Password: React.FC<PasswordProps> = ({ variant, setNewState }) => {
    const { isDarkMode } = useTheme()
    const { formData, errors, handleChange, handleSubmit, resetForm } = useForm(
        { name: "", phone: '', email: "" }, setNewState, { passwordRequired: false });

    const [isShowAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState<'positive' | 'negative' | 'info'>('info');
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const isSuccess = await handleSubmit(e);
            console.log("Результат отправки формы:", isSuccess);
            if (isSuccess) {
                // Успешная отправка
                localStorage.setItem('userData', JSON.stringify(formData));
                setAlertMessage("Новый пароль был выслан на ваш адрес электронной почты.");
                setAlertVariant('positive');
                resetForm();
            } else {
                // Ошибка валидации
                setAlertMessage("Данные введены не корректно.");
                setAlertVariant('negative');
            }
        } catch (error) {
            // Ошибка при отправке
            console.error("Ошибка при отправке формы:", error); // Логируем ошибку
            setAlertMessage("Произошла ошибка при отправке формы.");
            setAlertVariant('negative');
        } finally {
            // Всегда показываем алерт и сбрасываем загрузку
            setShowAlert(true);
            setIsLoading(false);

            // Автоматическое скрытие алерта через 3 секунды
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    }

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const isFormValid = Object.keys(errors).length === 0 && formData.email;

    return (
        <>
            <h2 className={styles.title}>Забыли пароль?</h2>
            <div className="flex">
                <Link href="/" className={styles.link}>Главная</Link>
                <span className={styles.separator}>-</span>
                <Link href="/privetofficepage" className={styles.link}>Личный кабинет</Link>
                <span className={styles.separator}>- Забыли пароль?</span>
            </div>

            <Alert
                isOpen={isShowAlert}
                onClose={handleCloseAlert}
                variant={alertVariant || variant}//используете variant из пропсов, если alertVariant не установлен.
            >
                {alertMessage}
            </Alert>

            <div className={`${styles.passwordContainer} ${isDarkMode ? 'bg-dark' : 'bg-lght'}`}>
                <form onSubmit={handleFormSubmit} method="dialog">
                    <div className={styles.emailInput}>
                        <Input
                            label="Имя"
                            type="text"
                            name="name"
                            value={formData.name??''}
                            onChange={handleChange}
                            error={errors.name}
                        />
                        <Input
                            className={errors.email ? "border-red-500" : ""}
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email??""}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <Input
                            label="Телефон"
                            type="tel"
                            name="phone"
                            value={formData.phone??''}
                            onChange={handleChange}
                            error={errors.phone}
                        />
                    </div>
                    <div className="mt-6">
                        <Link href="/privetofficepage" className={styles.backButton}>Назад</Link>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={!isFormValid}
                            isLoading={isLoading}
                            className={styles.submitButton}
                        >
                            Отправить
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Password;
