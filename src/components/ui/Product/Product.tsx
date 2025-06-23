import React, { useEffect } from "react";
import { VscTrash } from "react-icons/vsc";
import { observer } from "mobx-react-lite"; // Импортируем observer
import catalogueStore from "@/store/CatalogueStore";
import Image from "next/image"; 
import { useCart } from '@/context/CartContext'; 
import { ProductItem } from '@/types/types';

export interface ProductProps {
  item: ProductItem;
}
// Определяем интерфейс для типа продукта
// interface ProductProps {
//   item: {
//     id: string;
//     name: string;
//     category: string;
//     color: string | string[];
//     price: string;
//     imgSrc: string;
//     quantity: number;
//   };
// }

const Product: React.FC<ProductProps> = observer(({ item }) => {
  const { addToCart, removeFromCart, deleteProduct } = useCart(); // Используем контекст

  useEffect(() => {
    catalogueStore.initializeBasket(); // Инициализация корзины после монтирования
  }, []);

  const { name, category, color, price, imgSrc, id, quantity } = item;

  const handleIncrement = () => {
    catalogueStore.incrementProductQuantity(id); // Увеличиваем количество в store
    addToCart();
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      catalogueStore.decrementProductQuantity(id); // Уменьшаем количество в store
      removeFromCart();
    }
  };

  const handleDeleteProduct = () => {
    deleteProduct(quantity); // Вызываем deleteProduct из контекста
    catalogueStore.clearProduct(id); // Также вызываем метод из store для удаления товара
  };

  const numericPrice = parseFloat(price); // Преобразуем в число
 const total = Number((numericPrice * (catalogueStore.basket.find(p => p.id === id)?.quantity ?? 0)).toFixed(2));


  return (
    <div className="product-container"> {/* Основной контейнер */}
      <Image width="100" src={imgSrc} alt={name} className="product-image" /> {/* Изображение */}
      <div className="product-info"> {/* Информация о продукте */}
        <h2 className="product-name">{name}</h2>
        <p className="product-category">Категория: {category}</p>
        <div className='product-colors'>
          {Array.isArray(color) ? (
            color.map((c, index) => (
              <div
                key={index}
                className="color-swatch"
                style={{ backgroundColor: c }}
              ></div>
            ))
          ) : (
            <div
              className="color-swatch"
              style={{ backgroundColor: color }}
            ></div>
          )}
        </div>
        <p className="product-price">Цена: {numericPrice.toFixed(2)}</p>
        <p className="product-total">Всего: {total}</p>
      </div>
      <div className="product-actions"> {/* Контейнер для кнопок */}
        <div className="product-buttons"> {/* Flex для кнопок увеличения/уменьшения */}
          <button
            className="button-decrement"
            onClick={handleDecrement}
            disabled={quantity === 1}
          >
            -
          </button>
          <h3 className="product-count">{quantity}</h3> {/* Счетчик */}
          <button className="button-increment" onClick={handleIncrement}>
            +
          </button>
        </div>
        <button 
          className="button-delete"
          onClick={handleDeleteProduct}
        >
          <VscTrash />
        </button>
      </div>
    </div>
  );
});

export default Product;
