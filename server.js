//server.js
import express from 'express';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();

// Обслуживаем статические файлы из папки 'public'
server.use(express.static(path.join(__dirname, 'public')));

app.prepare().then(() => {
  // Обработка всех запросов через Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
});
