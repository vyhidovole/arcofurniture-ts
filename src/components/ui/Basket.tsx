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
  catalogueStore.loadInitialData('someCategory');
}, []);

  return (
    <div>
      {catalogueStore.basket.length === 0 ? (
        <p>Корзина пуста</p>
      ) : (
        <div>
          <ul>
            {catalogueStore.basket.map((item: ProductItem) => (
              <Product  key={`${item.id}-${item.category}`} item={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Basket;
