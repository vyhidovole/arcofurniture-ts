// pages/api/works.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Добавьте CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Для OPTIONS запросов
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
 // Разрешаем только GET запросы (добавьте это!)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' })
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/db.json`);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.works) {
      return res.status(200).json([]);
    }
    
    res.status(200).json(data.works);
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}
//Эти файлы — это серверные хендлеры (serverless functions) в Next.js, расположенные в папке /pages/api/.
//  Они обрабатывают HTTP-запросы от клиента (например, из браузера) и возвращают данные в формате JSON.
//  Основная цель — обеспечить CORS (Cross-Origin Resource Sharing), безопасность (только GET-запросы) и обработку ошибок,
//  чтобы приложение могло работать в различных средах (локально или на сервере).