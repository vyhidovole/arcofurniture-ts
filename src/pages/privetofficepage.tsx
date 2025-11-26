import React, { useState } from "react";
import Link from "next/link";
import ModalPrivetOffice from "@/components/ui/Modal/ModalPrivetOffice";
import { UserData, InitialState } from '@/types/types';
import styles from './privetofficepage.module.css'; // Импорт стилей

/**
 * Компонент для отображения страницы личного кабинета.
 * Содержит ссылки на главную страницу и страницу личного кабинета, 
 * а также модальное окно для авторизации пользователя.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий страницу личного кабинета.
 *
 * @example
 * return <PrivetOffice />;
 */
interface PrivetOfficeProps {
    data: InitialState

}
const PrivetOffice: React.FC<PrivetOfficeProps> = () => {

    const [, setUserData] = useState<UserData | null>(null); // Типизируем состояние


    const handleSetUserData = (data: Partial<InitialState>) => {
  if (data.name && data.email && data.password) {
            const user: UserData = { ...data as InitialState, id: 'newId' };//Добавил проверку внутри функции: если name, email и password определены, то создаём полноценный UserData и обновляем состояние. Это обеспечивает безопасность — форма не сможет отправить неполные данные (в коде формы это уже учтено валидацией).
            setUserData(user);
            console.log('User updated:', user);
        } else {
            console.warn('Incomplete form data; cannot set user data.');
        }
    };

    return (
        <>
            <div className={styles.container}>
                <Link href="/" className={styles.link}>Главная</Link>
                <span className={styles.separator}>-</span>
                <Link href="/privetofficepage" className={styles.link}>Личный кабинет</Link>
                <span className={styles.separator}>-</span>
                <p className={styles.authorizationText}>Авторизация</p>
            </div>
            <div className={styles.formContainer}>
                <ModalPrivetOffice
                    setNewState={handleSetUserData}
                    variant="default" // Добавляем обязательный пропс variant
                    isSpecial={true}  // Специальное место: активируем 20%/50% для инпутов

                />{/* Добавляем форму */}
            </div>

        </>
    );
}

export default PrivetOffice;
