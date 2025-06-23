import React, { useEffect } from "react";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext"; // Импортируем контекст загрузки
import Skeleton from "react-loading-skeleton"; // Импортируем скелетон
import "react-loading-skeleton/dist/skeleton.css"; // Импортируем стили для скелетона
import "./Footer.css"; // подключение файла стилей

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
        <footer className="footer">
          <div className="footer-container">

            <div className="footer-column">
              <Image src={"/images/logo.jpg"} alt="арко" width={167} height={30} priority />
              <h3 className="footer-title">8-961-925-6161</h3>
              <p className="footer-text">
                Время работы:
                <span className="footer-bold"> c 10:00 до 19:00</span>
              </p>
              <p className="footer-text">
                Адрес:
                <span className="footer-bold">ул. Московская 144 корп-1</span>
              </p>
              <a className="footer-link" href="#">Почта: mebelarko@mail.ru</a>
              <h3 className="footer-title">Мы в Инстаграме</h3>
              <a href="#">
                <Image src={"/images/inst.jpg"} alt="инстаграм" width={80} height={80} priority />
              </a>
              <a className="footer-copy" href="#">© Все права защищены.</a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Кухни</h3>
              <a target="_blank" className="footer-support" href="#">Маленькие кухни</a>
              <a target="_blank" className="footer-support" href="#">Готовые комплекты</a>
              <a target="_blank" className="footer-support" href="#">Модульные кухни</a>
              <a target="_blank" className="footer-support" href="#">Кухонный угол</a>
              <a target="_blank" className="footer-support" href="#">Угловые кухни</a>
              <a target="_blank" className="footer-support" href="#">Стулья для кухни</a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Гостиная</h3>
              <a target="_blank" className="footer-support" href="#">Модульные</a>
              <a target="_blank" className="footer-support" href="#">Журнальные столы</a>
              <a target="_blank" className="footer-support" href="#">Полки</a>
              <a target="_blank" className="footer-support" href="#">Тумбы под ТВ</a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Спальни</h3>
              <a target="_blank" className="footer-support" href="#">Кровати</a>
              <a target="_blank" className="footer-support" href="#">Матрацы</a>
              <a target="_blank" className="footer-support" href="#">Шкафы</a>
              <a target="_blank" className="footer-support" href="#">Комоды</a>
              <a target="_blank" className="footer-support" href="#">Столы туалетные</a>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Диваны</h3>
              <a target="_blank" className="footer-support" href="#">Прямые</a>
              <a target="_blank" className="footer-support" href="#">Угловые</a>
              <a target="_blank" className="footer-support" href="#">На металлокаркасе</a>
              <a target="_blank" className="footer-support" href="#">Кресла</a>
            </div>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;