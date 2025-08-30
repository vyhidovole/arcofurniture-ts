//products.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Для OPTIONS запросов (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Разрешаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    console.log('Загрузка продуктов из:', `${baseUrl}/db.json`);
    
    const response = await fetch(`${baseUrl}/db.json`);
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Данные из db.json:', data);
    
    // Проверяем, есть ли продукты в данных
    if (!data.Products) {
      console.warn('Продукты не найдены в db.json');
      return res.status(200).json([]);
    }
    
    console.log('Найдено продуктов:', data.Products.length);
    res.status(200).json(data.Products);
    
  } catch (error) {
    console.error('Ошибка при загрузке продуктов:', error);
    res.status(500).json({ error: 'Ошибка сервера при загрузке продуктов' });
  }
}
