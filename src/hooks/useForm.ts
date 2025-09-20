//useForm.ts
import React, { useState } from "react";
import { validateForm } from "../utils/validators";


export interface InitialState {

    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    confirmation?: string

}

interface Errors {
    [key: string]: string | undefined

}

interface UseFormReturn {
    formData: Partial<InitialState>;
    errors: Errors
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<boolean>
    resetForm: () => void

}
/**
 * Хук для управления состоянием формы, валидацией и обработки отправки данных.
 *
 * @param {Partial<InitialState>} initialState - Начальное состояние формы.
 * @param {(data: Partial<InitialState>) => void} setNewState - Функция для обновления состояния формы.
 * @returns {UseFormReturn} - Объект с состоянием формы, ошибками и функциями.
 */
function useForm(
    initialState: Partial<InitialState>,
    setNewState: (data: Partial<InitialState>) => void,
    options = { passwordRequired: true, confirmationRequired: true }// Добавляем опцию для confirmation
): UseFormReturn {
    // Состояние формы (значения полей)
    const [formData, setFormData] = useState<Partial<InitialState>>(initialState);
    // Состояние для отслеживания ошибок валидации
    const [errors, setErrors] = useState<Record<string, string>>({});



    /**
     * Обработчик при смене данных на элементе формы
     *
     * @param {Event} e - Объект события изменения данных на элементе формы
     */

    // const validateEmail = (email: string): boolean => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    // };
    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Простой пример для международного формата
        return phoneRegex.test(phone);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Валидация для каждого поля
        const newErrors = { ...errors }; // Копируем текущее состояние ошибок
        // Проверки только для полей, присутствующих в initialState
        switch (name) {
            case 'name':
                if ('name' in initialState) {
                    if (value.trim() === '') {
                        newErrors.name = 'Имя обязательно';
                    } else if (value.trim().length <= 1 || !/^[A-Za-zА-Яа-яЁё]+$/.test(value)) {
                        newErrors.name = 'Имя должно содержать более одной буквы и состоять только из букв';
                    } else {
                        delete newErrors.name;
                    }
                }
                break;

            case 'phone':
                if ('phone' in initialState) {
                    if (!validatePhone(value)) {
                        newErrors.phone = 'Некорректный номер телефона';
                    } else {
                        delete newErrors.phone;
                    }
                }
                break;

            case 'email':
                if ('email' in initialState) {
                    if (value.trim() === '') {
                        newErrors.email = 'Email обязателен';
                    } else if (!/\S+@\S+\.\S+/.test(value)) {
                        newErrors.email = 'Некорректный email';
                    } else {
                        delete newErrors.email;
                    }
                }
                break;

            case 'password':
                if ('password' in initialState) {
                    if (options.passwordRequired && value.trim() === '') {
                        newErrors.password = 'Пароль обязателен';
                    } else if (value.trim().length < 6) {
                        newErrors.password = 'Пароль должен быть не менее 6 символов';
                    } else {
                        delete newErrors.password;
                    }
                }
                break;
            case 'confirmation':
                if ('confirmation' in initialState) {
                    if (options.confirmationRequired && value.trim() === '') {
                        newErrors.confirmation = 'Подтверждение обязательно';
                    } else if (formData.password && value !== formData.password) {
                        newErrors.confirmation = 'Пароль набран не верно';
                    } else {
                        delete newErrors.confirmation;
                    }
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
        // Валидация только для полей из initialState
        const fieldsToValidate = Object.keys(initialState);
        const dataToValidate: Partial<InitialState> = {};
        for (const key of fieldsToValidate) {
            const value = formData[key as keyof InitialState];
            if (value !== undefined) {
                dataToValidate[key as keyof InitialState] = value;
            }
        }
        // Проверка наличия ошибок
        const validationErrors = validateForm(dataToValidate, options);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Устанавливаем ошибки
            console.log("Форма содержит ошибки:", validationErrors);
            return false
        }
        // Сохранение только присутствующих полей
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
            (value) => value && value.trim() === ""
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
