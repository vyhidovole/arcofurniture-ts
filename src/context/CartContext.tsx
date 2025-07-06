
import React, { createContext, useContext, ReactNode, useEffect,useState } from 'react';
import { observer } from 'mobx-react-lite';
import catalogueStore from '@/store/CatalogueStore';
import { ProductItem } from '@/types/types';
interface CartContextType {
  quantity: number;
  addToCart: (product: ProductItem) => void; // объект
  removeFromCart: (productId: string) => void;
  deleteProduct: (productId: string) => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

// Оборачиваем провайдер в observer, чтобы реагировать на изменения MobX стора
const CartProviderComponent = observer(({ children }: CartProviderProps) => {
  // quantity берём из MobX стора
  const quantity = catalogueStore.quantity;

  // Методы делегируем в store
  // Здесь предполагается, что у вас есть методы для работы с конкретным productId
  const [cart, setCart] = useState<ProductItem[]>(() => {
    // Читаем из localStorage при инициализации
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Сохраняем в localStorage при изменении cart
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product:ProductItem) => {
    setCart(prev=> [...prev, product]);
  };
  // const addToCart = (product: ProductItem) => {
  //   catalogueStore.addProductToBasket(product);
  // };

  const removeFromCart = (productId: string) => {
    catalogueStore.decrementProductQuantity(productId);
  };

  const deleteProduct = (productId: string) => {
    catalogueStore.deleteProductFromBasket(productId);
  };

  return (
    <CartContext.Provider value={{ quantity, addToCart, removeFromCart, deleteProduct }}>
      {children}
    </CartContext.Provider>
  );
});

export const CartProvider = ({ children }: CartProviderProps) => {
  return <CartProviderComponent>{children}</CartProviderComponent>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
