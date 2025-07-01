import React from "react";
import Head from "next/head";
import Catalogue from "@/components/ui/Catalogue/Catalogue";


/**
 * Главная страница приложения.
 * Отображает заголовок страницы и компонент каталога.
 *
 * @component
 * @returns {JSX.Element} Элемент, представляющий главную страницу.
 *
 * @example
 * return <Home />;
 */
/* Домашнаяя страница */
const Home = () => (
  <>
  <Head>
    <title>Arcofurniture</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  <Catalogue/>

  </>
  
  
);

export default Home;
