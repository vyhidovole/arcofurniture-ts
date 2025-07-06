import React,{useEffect} from "react";
import { observer } from "mobx-react-lite";
import catalogueStore from "@/store/CatalogueStore"; // Импортируйте ваше MobX хранилище
import Product from "./Product/Product"; // Импортируйте компонент Product
import { ProductItem } from '@/types/types';

/**
 * Компонент для отображения корзины покупок.
 *
 * Этот компонент использует MobX для управления состоянием корзины.
 * При монтировании компонента корзина инициализируется, загружаются
 * сохраненные товары из localStorage, а также корзина сохраняется
 * в localStorage при изменении.
 *
 * @component
 * @returns {JSX.Element} Элемент корзины покупок.
 *
 * @example
 * return <Basket />;
 */
const Basket: React.FC = observer(() => {
useEffect(() => {
  catalogueStore.loadInitialData();
}, []);

  return (
    <div>
      {catalogueStore.basket.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          <ul>
            {catalogueStore.basket.map((item: ProductItem) => (
              <Product key={item.id} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Basket;
// Загружаем сохраненные товары из localStorage при монтировании компонента
  // useEffect(() => {
    
  //   const savedBasket = localStorage.getItem("basket");
  //   if (savedBasket) {
  //     const parsedBasket = JSON.parse(savedBasket);
  //     console.log("Загруженная корзина:", parsedBasket); // Отладочное сообщение
  //     catalogueStore.setBasket(parsedBasket);
  //   } else {
  //     console.log("Корзина пуста, нет данных в localStorage."); // Сообщение, если корзина пуста
  //   }
  // }, []);
//   useEffect(() => {
//   if (typeof window !== 'undefined') {
//     const savedBasket = localStorage.getItem("basket");
//     if (savedBasket) {
//       const parsedBasket = JSON.parse(savedBasket);
//       catalogueStore.setBasket(parsedBasket);
//     }
//   }
// }, []);
// useEffect(() => {
//   if (typeof window !== 'undefined') {
//     const savedBasket = localStorage.getItem("basket");
//     if (savedBasket) {
//       catalogueStore.setBasket(JSON.parse(savedBasket));
//     }
//   }
// }, []);


  // Сохраняем товары в localStorage при изменении корзины
  // useEffect(() => {
  //   localStorage.setItem("basket", JSON.stringify(catalogueStore.basket));
  // }, [catalogueStore.basket]);
