
/**
 * Валидаторы для полей формы.
 * @property {function(string): string|null} name - Валидатор для текстового поля.
 * @property {function(string): string|null} email - Валидатор для электронной почты.
 * @property {function(string): string|null} phone - Валидатор для телефона.
 * @property {function(string): string|null} password - Валидатор для пароля.
 * @property {function(string): string|null} number - Валидатор для числовых полей.
 */
interface ValidatorProps {

  name: (value: string) => string | null
  email: (value: string) => string | null
  phone: (value: string) => string | null
  password: (value: string) => string | null
  number: (value: string) => string | null
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
 * 
 */

interface ValidationResult {
  [field: string]: string
}

export function validateForm(
  formData: Record<string, string>,
  options: { passwordRequired: boolean }
): ValidationResult {
  const validationErrors: ValidationResult = {};

  Object.entries(formData).forEach(([fieldName, value]) => {
    // Если поле password не обязательно и пустое — пропускаем валидацию
    if (fieldName === 'password' && !options.passwordRequired && value.trim() === '') {
      return;
    }

    const validator = validators[fieldName as keyof ValidatorProps];
    if (validator) {
      const errorMessage = validator(value);
      if (errorMessage) {
        validationErrors[fieldName] = errorMessage;
      }
    }
  });

  return validationErrors;
}
//Объяснение

// Создаём пустой объект validationErrors.
// Проходим по всем полям formData.
// Для каждого поля вызываем соответствующий валидатор.
// Если валидатор возвращает ошибку — добавляем её в validationErrors.
// Особенность для поля password: если passwordRequired — false и поле пустое — пропускаем валидацию.
// Возвращаем объект с ошибками.


// Если вам нужно валидировать только одно поле (например, при изменении), то вызов validateForm должен быть вне этой функции, например:

// const newErrors = {
//   ...errors,
//   [name]: validateForm({ [name]: value }, { passwordRequired: true })[name],
// };

// Но это уже в месте использования, а не внутри самой validateForm.