
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import Image from 'next/image'; 

import 'swiper/swiper-bundle.css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from'./SliderStyles.module.css'; // Импорт стилей из CSS

// Типизация товара
interface Product {
  id: number | string;
  name: string;
  imgSrc?: string;
  category: string;
  color: string | string[];
  price: string;
}

// Пропсы компонента
interface CustomSlider2Props {
  data: Product[];
  loading: boolean;
}

/**
 * Компонент для отображения слайдера товаров.
 *
 * Этот компонент использует библиотеку Swiper для отображения списка товаров
 * в виде слайдера. При загрузке отображается скелетон.
 */
const CustomSlider2: React.FC<CustomSlider2Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className={styles["skeleton-wrapper"]}>
        <Skeleton height={250} width={200} count={3} style={{ marginRight: 15 }} />
      </div>
    );
  }

  return (
    <div className={styles["custom-slider-wrapper"]}>
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={15}
        navigation
        breakpoints={{
          480: { slidesPerView: 2 },
          740: { slidesPerView: 3 },
          1275: { slidesPerView: 4 },
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id} className={styles["slide-center"]}>
            <div className={styles["product-card"]}>
              <Image
                src={item.imgSrc || '/path/to/default-image.jpg'}
                alt={item.name}
                className={styles["product-image"]}
              />
              <h2 className={styles["product-name"]}>{item.name}</h2>
              <p className={styles["product-category"]}>{item.category}</p>
              <div className={styles["color-container"]}>
                {Array.isArray(item.color) ? (
                  item.color.map((color, index) => (
                    <div
                      key={index}
                      className={styles["color-circle"]}
                      style={{ backgroundColor: color, borderRadius: '10%' }}
                    />
                  ))
                ) : (
                  <div
                    className={styles["color-circle"]}
                    style={{ backgroundColor: item.color, borderRadius: '50%' }}
                  />
                )}
              </div>
              <p className={styles["product-price"]}>{item.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CustomSlider2;
