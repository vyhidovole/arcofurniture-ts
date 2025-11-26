// В этом проекте не применяется. В место него useForm.

// import { useState } from "react";
// import { validateForm } from "../utils/validators";

// interface InitialState {
//     [key:string]:string
// }

// interface Errors {
//     [key:string]:string|undefined
// }

// interface UseValidateReturn {
//     formState:InitialState
//     errors:Errors
//     handleInput:(e:React.ChangeEvent<HTMLInputElement>) => void
// }

// /**
//  * Хук для управления состоянием формы и валидацией.
//  *
//  * @param {initialState} initialState - Начальное состояние формы.
//  * @returns {UseValidateReturn} - Объект с состоянием формы, ошибками и функциями.
//  */
// function useValidate(initialState:InitialState):UseValidateReturn {
//   // Состояние формы, хранит значения полей
//   const [formState, setFormState] = useState<InitialState>(initialState);

//   // Состояние для отслеживания ошибок валидации
//   const [errors, setErrors] = useState<Errors>({});

//   // Состояние для отслеживания полей, в которых пользователь находился
//   // const [touchedFields, setTouchedFields] = useState({});

//   /**
//    * Обработчик изменения значения полей формы.
//    *
//    * @param {Object} e - Событие изменения.
//    */
//   const handleInput = (e:React.ChangeEvent<HTMLInputElement> ) => {
//     const { name, value } = e.target;

//     // Обновляем состояние формы для текущего поля
//     const updatedFormState = { ...formState, [name]: value };
//     setFormState(updatedFormState);

//     // Валидируем только текущее поле
//     const validationErrors = {
//       ...errors,
//       [name]: validateForm({ [name]: value })[name],
      
// // 1. Создается временный объект { [name]: value }, где [name] — это динамическое имя свойства,
// //    то есть название поля формы, которое сейчас валидируем.
// // 2. Передается этот объект в функцию validateForm, которая возвращает объект ошибок типа ValidationResult.
// // 3. После вызова validateForm, мы сразу обращаемся к свойству этого объекта по ключу [name], чтобы получить сообщение об ошибке или undefined, если ошибки нет.
// // 4. В итоге, мы присваиваем это сообщение свойству [name] в объекте validationErrors, чтобы обновить ошибку для этого конкретного поля без трогания других полей.
//     };

//     // Обновляем состояние ошибок
//     setErrors(validationErrors);
//   };

//   // Внутренний обработчик фокуса
//   // const handleBlur = (e) => {
//   //   const { name } = e.target;

//   //   // Устанавливаем касаемость поля внутри хука
//   //   setTouchedFields((prevTouched) => ({ ...prevTouched, [name]: true }));
//   // };

//   return {
//     formState,
//     errors,
//     handleInput,
//   };
// }

// export default useValidate;
