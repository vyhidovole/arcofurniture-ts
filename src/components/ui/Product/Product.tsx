import React from "react";
import { VscTrash } from "react-icons/vsc";
import { observer } from "mobx-react-lite"; // Импортируем observer
import Image from "next/image"; 
import { useCart } from '@/context/CartContext'; 
import { ProductItem } from '@/types/types';
import styles from './Product.module.css'

export interface ProductProps {
  item: ProductItem;
 
}


const Product: React.FC<ProductProps> = observer(({ item }) => {
  const cartStore = useCart(); // Используем контекст

  

  const { name, category, color,  imgSrc, id } = item;
  const productInBasket = cartStore.basket.find(p => p.id === item.id);
const quantity = productInBasket?.quantity ?? 0;

  
  const handleIncrement = () => {
    cartStore.incrementProductQuantity(item.id); // Увеличиваем количество в store
    
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      cartStore.decrementProductQuantity(item.id); // Уменьшаем количество в store
      
    }
  };

  const handleDeleteProduct = () => {
    cartStore.deleteProductFromBasket(item.id.toString()); // Вызываем deleteProduct из контекста
    cartStore.clearProduct(id.toString()); // Также вызываем метод из store для удаления товара
  };

  const numericPrice = parseFloat(item.price); // Преобразуем в число
  const total = Number((numericPrice * quantity).toFixed(2));



  return (
    <div className={styles["product-container"]}> {/* Основной контейнер */}
      <Image width="100"height='100' src={imgSrc} alt={name} className={styles["product-image"]} /> {/* Изображение */}
      <div className={styles["product-info"]}> {/* Информация о продукте */}
        <h2 className={styles["product-name"]}>{name}</h2>
        <p className={styles["product-category"]}>Категория: {category}</p>
        <div className={styles['product-colors']}>
          {Array.isArray(color) ? (
            color.map((c, index) => (
              <div
                key={index}
                className={styles["color-swatch"]}
                style={{ backgroundColor: c }}
              ></div>
            ))
          ) : (
            <div
              className={styles["color-swatch"]}
              style={{ backgroundColor: color }}
            ></div>
          )}
        </div>
        <p className={styles["product-price"]}>Цена: {numericPrice.toFixed(2)}</p>
        <p className="product-total">Всего: {total}</p>
      </div>
      <div className={styles["product-actions"]}> {/* Контейнер для кнопок */}
        <div className={styles["product-buttons"]}> {/* Flex для кнопок увеличения/уменьшения */}
          <button
            className={styles["product-sub"]}
            onClick={handleDecrement}
            disabled={quantity === 1}
          >
            -
          </button>
          <h3 className={styles["product-count"]}>{quantity}</h3> {/* Счетчик */}
          <button className={styles["product-add"]} onClick={handleIncrement}>
            +
          </button>
        </div>
        <button 
          className={styles["button-delete"]}
          onClick={handleDeleteProduct}
        >
          <VscTrash />
        </button>
      </div>
    </div>
  );
});

export default Product;
