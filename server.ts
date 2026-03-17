/**
 * server.ts — PsyFusions
 * =======================
 * Express сервер: API для форм + раздача Vite/статики.
 *
 * ТЕКУЩЕЕ СОСТОЯНИЕ:
 *   Заявки принимаются, но только логируются в консоль.
 *   Для реальной отправки → подключи Telegram Bot (инструкция ниже).
 *
 * КАК ДОБАВИТЬ УВЕДОМЛЕНИЯ В TELEGRAM:
 *   1. Создай бота через @BotFather, получи TELEGRAM_BOT_TOKEN
 *   2. Узнай свой TELEGRAM_CHAT_ID (через @userinfobot)
 *   3. Добавь в .env:
 *        TELEGRAM_BOT_TOKEN=123456:ABC...
 *        TELEGRAM_CHAT_ID=123456789
 *   4. Раскомментируй блок "Telegram notification" ниже
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

async function startServer() {
  const app  = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ─── API роуты ────────────────────────────────────────────────

  app.post('/api/contact', async (req, res) => {
    const { name, contact, message, source, score, result } = req.body;

    // Логирование заявки
    console.log(`\n📩 Новая заявка [${source}]:`);
    console.log(`   Имя:     ${name}`);
    console.log(`   Контакт: ${contact}`);
    if (message) console.log(`   Запрос:  ${message}`);
    if (score !== undefined) console.log(`   Тест:    ${result} (${score} баллов)`);

    // ── Telegram notification (раскомментировать когда будет готово) ──
    /*
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const text = [
        `📩 *Новая заявка* — ${source}`,
        `👤 Имя: ${name}`,
        `📱 Контакт: ${contact}`,
        message ? `💬 Запрос: ${message}` : null,
        score !== undefined ? `🧠 Тест: ${result} (${score} баллов)` : null,
      ].filter(Boolean).join('\n');

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      });
    }
    */

    res.json({
      success: true,
      message: 'Заявка успешно получена. Оксана свяжется с вами в ближайшее время.',
    });
  });

  // ─── Vite / Статика ──────────────────────────────────────────

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`\n🚀 PsyFusions запущен: http://localhost:${PORT}\n`);
  });
}

startServer();
