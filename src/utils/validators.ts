
// validators.ts
import { InitialState } from '@/hooks/useForm'; // Импорт InitialState из useForm.ts

/**
 * Валидаторы для полей формы.
 * @property {function(string, Partial<InitialState>): string|null} name - Валидатор для текстового поля.
 * @property {function(string): string|null} email - Валидатор для электронной почты.
 * @property {function(string): string|null} phone - Валидатор для телефона.
 * @property {function(string): string|null} password - Валидатор для пароля.
 * @property {function(string | undefined, Partial<InitialState>): string|null} confirmation - Валидатор для подтверждения пароля.
 * @property {function(string): string|null} number - Валидатор для числовых полей.
 */
interface ValidatorProps {
  name: (value: string) => string | null;
  email: (value: string) => string | null;
  phone: (value: string) => string | null;
  password: (value: string) => string | null;
  confirmation: (value: string | undefined, formData: Partial<InitialState>) => string | null;  // Обновлен тип
  number: (value: string) => string | null;
}

const validators: ValidatorProps = {
  /**
   * Валидатор для текстового поля.
   * @param {string} value - Значение поля.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  name: (value: string): string | null => {
    if (!value) return "field is required";
    const regexText = /^[^!>?<_\-$№#@]+$/;
    if (!regexText.test(value)) return "Text should not contain !>?<_-$№#@ symbols";
    return null;
  },
  /**
   * Валидатор для электронной почты.
   * @param {string} value - Значение поля.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  email: (value: string): string | null => {
    if (!value) return "field is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) return "Invalid email";
    return null;
  },
  /**
   * Валидатор для телефона.
   * @param {string} value - Значение поля.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  phone: (value: string): string | null => {
    if (!value) return "field is required";
    if (!/^\+?[0-9-]+$/.test(value)) return "Invalid phone number";
    return null;
  },
  /**
   * Валидатор для пароля.
   * @param {string} value - Значение поля.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  password: (value: string): string | null => {
    if (!value) return "field is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    return null;
  },
  /**
   * Валидатор для подтверждения пароля.
   * @param {string | undefined} value - Значение поля (может быть undefined).
   * @param {Partial<InitialState>} formData - Данные формы для доступа к password.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  confirmation: (value: string | undefined, formData: Partial<InitialState>): string | null => {
    if (!value || value.trim() === '') return "field is required";  // Обрабатываем undefined как пустое
    if (formData.password && value !== formData.password) {
      return "Пароль набран не верно";
    }
    return null;
  },
  /**
   * Валидатор для числовых полей.
   * @param {string} value - Значение поля.
   * @returns {string|null} - Сообщение об ошибке или null, если валидация прошла успешно.
   */
  number: (value: string): string | null => {
    if (!value) return "field is required";
    if (isNaN(Number(value))) return "Must be a number";
    return null;
  },
};

/**
 * Функция для валидации формы на основе предоставленных валидаторов.
 *
 * @param {Object} formData - Данные формы, представленные в виде объекта.
 * @returns {Object} - Объект с сообщениями об ошибках для каждого поля формы.
 */
export function validateForm(
  data: Partial<InitialState>,
  options: { passwordRequired: boolean }
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Валидация name с использованием существующего валидатора и дополнительными проверками
  if ('name' in data && data.name !== undefined) {
    const baseError = validators.name(data.name);
    if (baseError !== null) {  // Явная проверка на null
      errors.name = baseError;  // Теперь baseError - string
    } else if (data.name.trim() === '') {
      errors.name = 'Имя обязательно';
    } else if (data.name.trim().length <= 1 || !/^[A-Za-zА-Яа-яЁё]+$/.test(data.name)) {
      errors.name = 'Имя должно содержать более одной буквы и состоять только из букв';
    }
  }

  // Валидация email с использованием существующего валидатора
  if ('email' in data && data.email !== undefined) {
    const baseError = validators.email(data.email);
    if (baseError !== null) {  // Явная проверка на null
      errors.email = baseError;  // Теперь baseError - string
    } else if (data.email.trim() === '') {
      errors.email = 'Email обязателен';
    }
  }

  // Валидация phone с использованием существующего валидатора
  if ('phone' in data && data.phone !== undefined) {
    const baseError = validators.phone(data.phone);
    if (baseError !== null) {  // Явная проверка на null
      errors.phone = baseError;  // Теперь baseError - string
    }
  }

  // Валидация password с использованием существующего валидатора и опциями
  if ('password' in data && data.password !== undefined) {
    const baseError = validators.password(data.password);
    if (baseError !== null) {  // Явная проверка на null
      errors.password = baseError;  // Теперь baseError - string
    } else if (options.passwordRequired && data.password.trim() === '') {
      errors.password = 'Пароль обязателен';
    } else if (data.password.trim().length < 8) {
      errors.password = 'Пароль должен быть не менее 8 символов';
    }
  }

  // Валидация confirmation с использованием нового валидатора
  if ('confirmation' in data) {
    const baseError = validators.confirmation(data.confirmation, data);  // Теперь типы совпадают
    if (baseError !== null) {  // Явная проверка на null
      errors.confirmation = baseError;  // Теперь baseError - string
    }
  }

  return errors;
}
