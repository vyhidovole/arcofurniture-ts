import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import catalogueStore from "@/store/CatalogueStore";
import { useLoading } from "@/context/LoadingContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Catalogue.module.css";
import { useRouter } from "next/router";
import { autorun } from "mobx";
const Catalogue = observer(() => {
  useEffect(() => {
  const disposer = autorun(() => {
    const uids = catalogueStore.catalogueproducts.map(item => item.uid);
    const duplicates = uids.filter((uid, i) => uids.indexOf(uid) !== i);
    if (duplicates.length > 0) {
      console.warn("Duplicate uids found:", duplicates);
    }
  });

  return () => disposer();
}, []);
  const router = useRouter();
  const { loading, setLoading } = useLoading();

  // Получаем текущий ключ категории из URL
  const getCategoryKey = () => {
    if (!router.isReady) return "all";
    const segments = router.asPath.split("/").filter(Boolean);
    let categoryKey = segments[1] || "all";
    if (categoryKey === "catalogueproducts") {
      categoryKey = "all";
    }
    return categoryKey;
  };

  const categoryKey = getCategoryKey();

  useEffect(() => {
    if (!router.isReady) return;

    setLoading(true);
    catalogueStore
      .loadInitialData(categoryKey)
      .finally(() => setLoading(false));
  }, [router.isReady, router.asPath, categoryKey, setLoading]);
  if (categoryKey === "all") {
    catalogueStore.catalogueproducts.forEach((item, index) => {
      console.log(`Категория ключ: cat-${item.uid}-${index}`, item);
    });
  }
  // Рендерим товары, если выбрана конкретная категория
  const renderProducts =
  catalogueStore.products.length > 0
    ? catalogueStore.products.map((item, index) => {
        const uid = item.uid ?? `prod-${index}`;
        const key = `${uid}-${index}`;
        return (
          <div key={key} className={styles["catalogue-container"]}>
            <Image
              src={item.imgSrc || "/path/to/default-image.jpg"}
              alt={item.name}
              width={250}
              height={185}
              className={styles["catalogue-img"]}
            />
            <Link
              href={`/category/${encodeURIComponent(uid)}`}
              className={styles["catalogue-button"]}
            >
              {item.name}
            </Link>
          </div>
        );
      })
    : null;


  // Рендерим категории, если выбрана категория "all"
 const renderCategories =
  catalogueStore.catalogueproducts.length > 0
    ? catalogueStore.catalogueproducts.map((item, index) => {
        const uid = item.uid ?? item.id ?? item.name ??`cat-${index}`; // uid обязателен, fallback на индекс
         const key = `${uid}-${index}`; // гарантируем уникальность ключа
        return (
          <div key={key} className={styles["catalogue-container"]}>
            <Image
              src={item.imgSrc || "/path/to/default-image.jpg"}
              alt={item.name}
              width={250}
              height={185}
              className={styles["catalogue-img"]}
            />
            <Link
              href={`/category/${encodeURIComponent(uid)}`}
              className={styles["catalogue-button"]}
            >
              {item.name}
            </Link>
          </div>
        );
      })
    : null;



  return (
    <div className={styles["catalogue-firstcontainer"]}>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className={styles["catalogue-secondcontainer"]}>
            <Skeleton height="100%" />
          </div>
        ))
      ) : categoryKey === "all" ? (
        renderCategories || <div>Категории не найдены</div>
      ) : (
        renderProducts || <div>Товары не найдены</div>
      )}
    </div>
  );
});

export default Catalogue;

