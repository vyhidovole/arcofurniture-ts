import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react";
import catalogueStore from "@/store/CatalogueStore";
import { useLoading } from "@/context/LoadingContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./Catalogue.module.css"
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { loading, setLoading } = useLoading();

 useEffect(() => {
  if (!router.isReady) return;

  const segments = router.asPath.split("/").filter(Boolean);
  let categoryKey = segments[0] || "all";

  if (categoryKey === "catalogueproducts") {
    categoryKey = "all";
    
  }

  setLoading(true);
  catalogueStore.loadInitialData(categoryKey).finally(() => setLoading(false));
}, [router.isReady, router.asPath, setLoading]);


  const productLinks: Record<
    | "каталог"
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
    каталог: "/catalogueproducts",
    кухни: "/kitchen",
    гостиные: "/drawingroom",
    детские: "/nursery",
    спальни: "/bedroom",
    диваны: "/couch",
    прихожие: "/hallway",
    "шкафы-купе": "/cupboard",
    "столы и стулья": "/tables_and_chairs",
  };

  function isProductKey(key: string): key is keyof typeof productLinks {
    return key in productLinks;
  }
if (catalogueStore.products.length === 0 && !loading) {
  return <div>Товары не найдены</div>;
}
  const renderData =
    catalogueStore.products.length > 0 &&
    catalogueStore.products.map((item) => {
      const key = item.name.toLowerCase();
      const href = isProductKey(key) ? productLinks[key] : "/default";


      return (
        <div
          key={item.uid}
          className={styles["catalogue-container"]}
        >
          <Image
            src={item.imgSrc || "/path/to/default-image.jpg"}
            alt={item.name}
            width={250}
            height={185}
            className={styles["catalogue-img"]}
          />
          <Link href={encodeURI(href)} className={styles["catalogue-button"]} >

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
