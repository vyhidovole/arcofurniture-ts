//[slug].tsx
import React from "react";
import { useRouter } from 'next/router';
import CategoryPageContent from '@/components/CategoryPageContent';


const CategoryPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const categoryStr = !slug || Array.isArray(slug) ? "all" : slug;

  // Проверка готовности (важно для SSR/SSG)
  // if (!router.isReady) {
  //   return <div>Loading...</div>;  // Или скелетон
  // }

  return (
    <div>
      {/* <h1>Категория: {categoryStr}</h1> */}
      <CategoryPageContent category={categoryStr} />
    </div>
  );
};

export default CategoryPage;
{/**
    Файл /category/[slug].tsx: Это динамическая страница Next.js. Она обрабатывает все URL вида /category/* 
    (например, /category/kitchen, /category/bedroom).
        useRouter(): Получает текущий маршрут.
        router.query.slug: Извлекает параметр slug из URL (например, 'kitchen').
        categoryStr: Переменная для обработки slug.
            Если slug отсутствует или является массивом (редкий случай в Next.js), устанавливается "all" (fallback).
            Иначе — использует slug как строку.
        Затем categoryStr передаётся в <CategoryPageContent category={categoryStr} />.
    Что происходит: Страница не "рисует" напрямую {category.label} из массива categories. 
    Вместо этого она передаёт slug в компонент 
    CategoryPageContent, который, вероятно, использует этот slug для отображения контента (включая название категории).
 */}