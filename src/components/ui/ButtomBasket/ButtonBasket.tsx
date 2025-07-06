import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton'; 
import catalogueStore from "@/store/CatalogueStore";
import styles from "./ButtonBasket.module.css"; 

interface ButtonBasketProps {
  loading: boolean;
  onClick: () => void;
}

const ButtonBasket: React.FC<ButtonBasketProps> = observer(({ loading, onClick }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const quantity = catalogueStore.totalQuantity;

  return (
    <button type="button" className={styles["button-basket"]} onClick={onClick}>
      {loading ? (
        <div className={styles["round-skeleton"]}></div>
      ) : (
        <svg
          data-slot="icon"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          ></path>
        </svg>
      )}
      <p className={styles["underline-animation"]}>
        {loading ? <Skeleton width={50} /> : "Корзина"}
      </p>
      <span className={styles["header-count"]}>
        {isMounted ? quantity : <Skeleton width={20} />}
      </span>
    </button>
  );
});

export default ButtonBasket;
