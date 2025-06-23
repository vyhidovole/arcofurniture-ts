import React, { useState } from 'react';
import Link from "next/link";
import Skeleton from 'react-loading-skeleton'; // Импортируем Skeleton для индикации загрузки
import 'react-loading-skeleton/dist/skeleton.css'; // Импортируем стили для Skeleton
import { useLoading } from '@/context/LoadingContext'; // Импорт кастомного хука

/**
 * Компонент поля поиска для каталога товаров.
 *
 * Этот компонент позволяет пользователю вводить текст для поиска
 * по доступным категориям товаров. При загрузке отображается индикатор загрузки.
 *
 * @component
 * @returns {JSX.Element} Элемент поля поиска с возможностью фильтрации категорий.
 *
 * @example
 * return (
 *   <SearchInput />
 * );
 */
const SearchInput = () => {
    // Инициализируем состояние для хранения введённого текста в поле поиска
    const [searchTerm, setSearchTerm] = useState('');
    const { loading } = useLoading(); // Получаем состояние загрузки из useLoading

    // Массив объектов, содержащих названия и пути к страницам
    const items = [
        { name: 'кухни', path: '/kitchen' },
        { name: 'гостиные', path: '/drawing-room' },
        { name: 'спальни', path: '/bedroom' },
        { name: 'прихожие', path: '/hallway' },
        { name: 'шкафы-купе', path: '/cupboard' },
        { name: 'детские', path: '/nursery' },
        { name: 'диваны', path: '/couch' },
        { name: 'столы и стулья', path: '/tables-and-chairs' },
    ];

    // Обработчик изменения поля ввода
    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        // Обновляем состояние searchTerm с новым значением из поля ввода
        setSearchTerm(event.target.value);
    };

    // Фильтруем элементы на основе введённого текста
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Сравниваем с учетом регистра
    );

    return (
        <div className="searchInput-container"> {/* Обёртка для позиционирования */}
            {loading ? (
                <Skeleton count={1} height={40} width="100%" /> 
            ) : (
                <>
                    <input
                        type="text"
                        value={searchTerm} // Значение поля ввода связано с состоянием
                        onChange={handleChange} // Устанавливаем обработчик изменения
                        placeholder="Поиск по каталогу"
                        className="searchInput"
                    />
                    {searchTerm && ( // Показываем список только если есть текст в поле поиска
                        <ul className="searchInput-ul">
                            {filteredItems.length > 0 ? ( // Проверяем, есть ли отфильтрованные элементы
                                filteredItems.map((item, index) => ( // Проходим по отфильтрованным элементам
                                    <li key={index} className="searchInput-result">
                                        <Link href={item.path} className="searchInput-resultLink"> {/* Ссылка на страницу по пути */}
                                            {item.name} {/* Название элемента */}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className="searchInput-noresult">Ничего не найдено</li>
                            )}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
};

export default SearchInput;
