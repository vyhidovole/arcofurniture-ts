import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react";
import catalogueStore from "@/store/CatalogueStore";
import { useLoading } from "@/context/LoadingContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./Catalogue.module.css"

/**
 * Компонент Catalogue отображает список продуктов.
 *
 * Этот компонент использует MobX для управления состоянием продуктов
 * и контекст загрузки для отображения состояния загрузки во время
 * получения данных с сервера.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий каталог продуктов.
 *
 * @example
 * <Catalogue />
 */
const Catalogue = observer(() => {
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const url = "/CatalogueProducts";
    setLoading(true);
    catalogueStore.getProducts(url).finally(() => {
      setLoading(false);
    });
  }, [setLoading]);

  const productLinks: Record<
    | "кухни"
    | "гостиные"
    | "детские"
    | "спальни"
    | "диваны"
    | "прихожие"
    | "шкафы-купе"
    | "столы и стулья",
    string
  > = {
    кухни: "/kitchen",
    гостиные: "/drawingroom",
    детские: "/nursery",
    спальни: "/bedroom",
    диваны: "/couch",
    прихожие: "/hallway",
    "шкафы-купе": "/cupboard",
    "столы и стулья": "/tables-and-chairs",
  };

  function isProductKey(key: string): key is keyof typeof productLinks {
    return key in productLinks;
  }

  const renderData =
    catalogueStore.products.length > 0 &&
    catalogueStore.products.map((item) => {
      const key = item.name.toLowerCase();
      const href = isProductKey(key) ? productLinks[key] : "/default";

      return (
        <div
          key={item.id}
          className={styles["catalogue-container"]}
        >
          <Image
            src={item.imgSrc || "/path/to/default-image.jpg"}
            alt={item.name}
            width={250}
            height={185}
            className={styles["catalogue-img"]}
          />
          <Link href={href} className={styles["catalogue-button"]} >
            
              {item.name}
            
          </Link>
        </div>
      );
    });

  return (
    <div className={styles["catalogue-firstcontainer"]}>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className={styles["catalogue-secondcontainer"]}
          >
            <Skeleton height="100%" />
          </div>
        ))
      ) : (
        renderData
      )}
    </div>
  );
});

export default Catalogue;
