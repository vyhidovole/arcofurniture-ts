import React, { useEffect } from "react";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext"; // Импортируем контекст загрузки
import Skeleton from "react-loading-skeleton"; // Импортируем скелетон
import "react-loading-skeleton/dist/skeleton.css"; // Импортируем стили для скелетона
import styles from"./Footer.module.css"; // подключение файла стилей

/**
 * Компонент Footer отображает нижний колонтитул сайта с информацией о компании
 * и ссылками на различные категории продуктов.
 *
 * Этот компонент использует контекст загрузки для отображения состояния загрузки
 * во время получения данных (например, логотипа).
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий нижний колонтитул сайта.
 *
 * @example
 * <Footer />
 */
const Footer: React.FC = () => {
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLoading(false);
    };
    fetchData();
  }, [setLoading]);

  return (
    <>
      {loading ? (
        <Skeleton height="auto" width="100%" />
      ) : (
        <footer className={styles["footer"]}>
          <div className={styles["footer-container"]}>

            <div className={styles["footer-column"]}>
              <Image src={"/images/logo.jpg"}
               alt="арко"
                width={167}
                 height={30}
                  priority 
                  className={styles.img_footer}
                  />
              <h3 className={styles["footer-title"]}>8-961-925-6161</h3>
              <p className={styles["footer-text"]}>
                Время работы:
                <span className={styles["footer-bold"]}> c 10:00 до 19:00</span>
              </p>
              <p className={styles["footer-text"]}>
                Адрес:
                <span className={styles["footer-bold"]}>ул. Московская 144 корп-1</span>
              </p>
              <a className={styles["footer-link"]} href="#">Почта: mebelarko@mail.ru</a>
              <h3 className={styles["footer-title"]}>Мы в Инстаграме</h3>
              <a href="#">
                <Image src={"/images/inst.jpg"}
                 alt="инстаграм" 
                 width={80} 
                 height={80} 
                 priority 
                 className={styles.img_footer}
                  />
              </a>
              <a className={styles["footer-copy"]} href="#">© Все права защищены.</a>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-title"]}>Кухни</h3>
              <a target="_blank" className={styles["footer-support"]} href="#">Маленькие кухни</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Готовые комплекты</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Модульные кухни</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Кухонный угол</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Угловые кухни</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Стулья для кухни</a>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-title"]}>Гостиная</h3>
              <a target="_blank" className={styles["footer-support"]} href="#">Модульные</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Журнальные столы</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Полки</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Тумбы под ТВ</a>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-title"]}>Спальни</h3>
              <a target="_blank" className={styles["footer-support"]} href="#">Кровати</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Матрацы</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Шкафы</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Комоды</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Столы туалетные</a>
            </div>

            <div className={styles["footer-column"]}>
              <h3 className={styles["footer-title"]}>Диваны</h3>
              <a target="_blank" className={styles["footer-support"]} href="#">Прямые</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Угловые</a>
              <a target="_blank" className={styles["footer-support"]} href="#">На металлокаркасе</a>
              <a target="_blank" className={styles["footer-support"]} href="#">Кресла</a>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;