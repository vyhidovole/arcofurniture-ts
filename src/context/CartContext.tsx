

import React from "react";
import catalogueStore from "@/store/CatalogueStore";



export const CartContext = React.createContext(catalogueStore);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CartContext.Provider value={catalogueStore}>{children}</CartContext.Provider>;
};

export const useCart = () => React.useContext(CartContext);
