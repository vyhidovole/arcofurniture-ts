// server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка статической папки
app.use(express.static(path.join(__dirname, 'public')));

// Обработка корневого маршрута
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
