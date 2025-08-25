import React, { useState } from "react";
import { validateForm } from "../utils/validators";

// export interface InitialState {
//     [key: string]: string

// }
export interface InitialState {
    [key: string]: string
    name: string;
    email: string;
    password: string;
   
}

interface Errors {
    [key: string]: string | undefined

}

interface UseFormReturn {
    formData: InitialState
    errors: Errors
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>
    resetForm: () => void

}
/**
 * Хук для управления состоянием формы, валидацией и обработки отправки данных.
 *
 * @param {InitialState} initialState - Начальное состояние формы.
 * @param {(data: InitialState) => void} setNewState - Функция для обновления состояния формы.
 * @returns {UseFormReturn} - Объект с состоянием формы, ошибками и функциями.
 */
function useForm(initialState: InitialState, setNewState: (data: InitialState) => void
): UseFormReturn {
    // Состояние формы (значения полей)
    const [formData, setFormData] = useState<InitialState>(initialState);
    // Состояние для отслеживания ошибок валидации
    const [errors, setErrors] = useState<Errors>({});



    /**
     * Обработчик при смене данных на элементе формы
     *
     * @param {Event} e - Объект события изменения данных на элементе формы
     */

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Простой пример для международного формата
        return phoneRegex.test(phone);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Валидация для каждого поля
        const newErrors = { ...errors }; // Копируем текущее состояние ошибок

        switch (name) {
            case 'name':
                // Проверка, что имя не пустое
                if (value.trim() === '') {
                    newErrors.name = 'Имя обязательно';
                }
                // Проверка, что имя содержит более одной буквы и состоит только из букв
                else if (value.trim().length <= 1 || !/^[A-Za-zА-Яа-яЁё]+$/.test(value)) {
                    newErrors.name = 'Имя должно содержать более одной буквы и состоять только из букв';
                } else {
                    delete newErrors.name; // Удаляем ошибку, если поле корректно заполнено
                }
                break;

            case 'email':
                if (!validateEmail(value)) {
                    newErrors.email = 'Некорректный email';
                } else {
                    delete newErrors.email; // Удаляем ошибку, если поле корректно заполнено
                }
                break;
            case 'password':
                if (value.length < 8) {
                    newErrors.password = 'Пароль должен содержать минимум 8 символов';
                } else {
                    delete newErrors.password; // Удаляем ошибку, если поле корректно заполнено
                }
                break;
            case 'phone':
                if (!validatePhone(value)) {
                    newErrors.phone = 'Некорректный номер телефона';
                } else {
                    delete newErrors.phone; // Удаляем ошибку, если поле корректно заполнено
                }
                break;
            default:
                break;
        }

        // Обновляем состояние ошибок
        setErrors(newErrors);
    };

    /**
     * Обработчик при отправке данных
     *
     * @param {Event} e - Объект события отправки формы
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        e.preventDefault();
        // Логируем состояние перед отправкой
        console.log('Состояние формы перед отправкой:', formData);
        console.log('Ошибки перед отправкой:', errors);

        // Проверка наличия ошибок
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Устанавливаем ошибки
            console.log("Форма содержит ошибки:", validationErrors);
            return false
        }

        // Если ошибок нет, передаем новые данные
        if (setNewState && typeof setNewState === 'function') {
            console.log('Состояние формы перед отправкой:', formData);
            setNewState(formData);
        }

        // Сохраняем данные в localStorage
        localStorage.setItem('formData', JSON.stringify(formData));
        console.log('Данные сохранены в localStorage:', formData);
        // Проверка наличия пустых полей
        const isEmptyField = Object.values(formData).some(
            (value) => value.trim() === ""
        );

        if (isEmptyField) {
            console.log("Поля обязательны к заполнению");

        } else {
            // Передать новые данные
            if (setNewState && typeof setNewState === "function") {
      setNewState(formData);
    }
      localStorage.setItem("formData", JSON.stringify(formData));
      console.log("Данные сохранены в localStorage:", formData);
      resetForm();
        }

        // Имитация отправки данных
         await new Promise((resolve) => {
            setTimeout(() => {
                console.log('Данные успешно отправлены:', formData); // Логируем данные
                resolve(true); // Успешная "отправка"
            }, 2000); // Задержка 2 секунды
        });
        return true;
    };

    /**
     * Функция для сброса состояния формы.
     */
    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return {
        formData,
        errors,
        handleChange,
        handleSubmit,
        resetForm,
    };

}

export default useForm;
