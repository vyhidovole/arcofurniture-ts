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
 * @param {(data: Partial<InitialState>) => void} setNewState - Функция обратного вызова для обработки успешной отправки(для обновления внешнего состояния (например, в родительском компоненте)).
 * @param options - Опции валидации формы. По умолчанию: { passwordRequired: true, confirmationRequired: true }.
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
     * @param {React.ChangeEvent<HTMLInputElement>} e - Объект события изменения данных (React SyntheticEvent для input-элементов).
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
                    // Проверка на пустую строку (после trim, чтобы игнорировать пробелы)
                    if (value.trim() === '') {
                        newErrors.phone = 'Поле обязательно для заполнения'; 
                    } else if (!validatePhone(value)) {
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
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
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
                    } else if (value.trim().length < 8) {
                        newErrors.password = 'Пароль должен быть не менее 8 символов';
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

        }
        // Обновляем состояние ошибок
        setErrors(newErrors);
    };

    /**
     * Обработчик при отправке данных
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Объект события отправки формы
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<boolean> => {
        e.preventDefault();
        // Логируем состояние перед отправкой
        console.log('Состояние формы перед отправкой:', formData);
        console.log('Ошибки перед отправкой:', errors);
        // Валидация только для полей из initialState
        // const fieldsToValidate = Object.keys(initialState);
        // const dataToValidate: Partial<InitialState> = {};
        // for (const key of fieldsToValidate) {
        //     const value = formData[key as keyof InitialState];
        //     if (value !== undefined) {
        //         dataToValidate[key as keyof InitialState] = value;
        //     }
        // }
        // Альтернатива валидации только для полей из initialState(более компактный)
        const dataToValidate: Partial<InitialState> = Object.fromEntries(//Собирает из массива пар новый объект dataToValidate
            Object.entries(initialState)//Превращает initialState (ваш начальный объект формы) в массив пар [ключ, значение](например, [['name', ''], ['phone', '']].
                .filter(([key]) => formData[key as keyof InitialState] !== undefined)
                .map(([key]) => [key, formData[key as keyof InitialState]]) // Для этих ключей берёт актуальные значения из formData
        );
        // Валидация через внешнюю функцию 
        const validationErrors = validateForm(dataToValidate, options);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // Устанавливаем ошибки
            console.log("Форма содержит ошибки:", validationErrors);
            return false
        }
       
        // Передать новые данные
        if (setNewState && typeof setNewState === "function") {
            setNewState(formData);
        }
        // Сохраняем в localStorage
        localStorage.setItem("userData", JSON.stringify(formData));
        console.log("Данные сохранены в localStorage:", formData);
        // Сбрасываем форму
        resetForm();


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
        localStorage.removeItem("userData"); // Если нужно очищать
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
