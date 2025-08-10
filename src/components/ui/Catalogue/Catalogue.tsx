import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import catalogueStore from "@/store/CatalogueStore";
import { useLoading } from "@/context/LoadingContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "./Catalogue.module.css";


const Catalogue = observer(() => {
  const { loading, setLoading } = useLoading();
  

  useEffect(() => {
    setLoading(true);
    // Загружаем только категории
    catalogueStore.loadCategories()
      .finally(() => setLoading(false));
  }, [setLoading]);

  const categories = catalogueStore.catalogueproducts;

  const renderLoadingSkeletons = () => (
    Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className={styles["catalogue-container"]}>
        <Skeleton height={250} />
      </div>
    ))
  );

  return (
    <div className={styles["catalogue-firstcontainer"]}>
      {loading ? (
        renderLoadingSkeletons()
      ) : categories.length > 0 ? (
        categories.map(cat => (
          <div key={cat.uid} className={styles["catalogue-container"]}>
            <Image
              src={cat.imgSrc || "/default-category.jpg"}
              alt={cat.name}
              width={250}
              height={185}
              className={styles["catalogue-img"]}
            />
            <Link href={`/category/${encodeURIComponent(cat.slug ?? 'all')}`} className={styles["catalogue-button"]}>
              {cat.name}
            </Link>
          </div>
        ))
      ) : (
        <p>Категории не найдены</p>
      )}
    </div>
  );
});

export default Catalogue;
