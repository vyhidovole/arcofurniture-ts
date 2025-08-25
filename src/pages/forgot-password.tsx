import React, { useState, } from "react"
import Link from "next/link";
import useForm from "@/hooks/useForm";
import Alert from "@/components/ui/Alert/Alert";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
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
    variant: 'default'|'positive' | 'negative'; // пример типа Variant
    setNewState: (data: InitialState) => void
}

const Password:React.FC<PasswordProps> = ({ variant, setNewState }) => {

    const { formData, errors, handleChange, handleSubmit, resetForm } = useForm(
        {name: "", email: "", password: ""}, setNewState);




    const [isShowAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState<'positive' | 'negative'| 'info'>('info'); // Установите начальное значение
    const [isLoading, setIsLoading] = useState(false); // Состояние загрузки
    /**
     * Обработчик отправки формы.
     * Предотвращает перезагрузку страницы, отправляет данные формы и управляет состоянием уведомлений.
     *
     *  @param {Event} e - Событие отправки формы.
     */
    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        setIsLoading(true); // Устанавливаем состояние загрузки
        // Вызываем handleSubmit из useForm для отправки данных
        const isSuccess = await handleSubmit(e); // Предполагается, что handleSubmit возвращает true/false

        // Если форма успешно отправлена и нет ошибок
         if(isSuccess) {
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
        setAlertMessage("Новый пароль был выслан на ваш адрес электронной почты.");
        setAlertVariant('positive'); // Установите нужный вариант
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
        setIsLoading(false); // Сбрасываем состояние загрузки
    }

    /**
     * Обработчик закрытия уведомления.
     * Скрывает уведомление при вызове.
     */
    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    const isFormValid = Object.keys(errors).length === 0  && formData.email ;

    return (
        <>
            <h2 className={styles.title}>Забыли пароль?</h2>
            <div className="flex">
                <Link href="/" className={styles.link}>Главная</Link>
                <span className={styles.separator}>-</span>
                <Link href="/privetofficepage" className={styles.link}>Личный кабинет</Link>
                <span className={styles.separator}>-</span>
                <p className={styles.link}>Забыли пароль?</p>
            </div>

            <Alert
                isOpen={isShowAlert}
                onClose={handleCloseAlert}
               variant={alertVariant || variant} // Используем variant
            >
                {alertMessage}
            </Alert>

            <form onSubmit={handleFormSubmit} method="dialog">
                <div className={styles.emailInput}>
                    <Input
                        className={errors.email ? "border-red-500" : ""}
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                </div>
                <div className="mt-6">
                    <Link href="/privetofficepage" className={styles.backButton}>назад</Link>

                    <Button
                        type="submit"
                        variant="secondary"
                        disabled={!isFormValid}
                        isLoading={isLoading} // Передаём состояние загрузки
                        className={styles.submitButton} // Добавляем класс для кнопки отправки
                    >
                        Отправить
                    </Button>
                </div>
            </form>
        </>
    );
}

export default Password;

