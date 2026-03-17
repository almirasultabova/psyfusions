# PsyFusions — Лендинг психолога Оксаны Миру

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Создать файл переменных окружения
cp .env.example .env

# 3. Запустить в режиме разработки
npm run dev
```

Сайт откроется по адресу: **http://localhost:3000**

---

## Как открыть проект в VS Code

1. Открой VS Code
2. Файл → Открыть папку → выбери `psyfusions/`
3. Установи расширение **Tailwind CSS IntelliSense** для автодополнения классов
4. Запусти терминал (`Ctrl+\``) и выполни `npm install && npm run dev`

---

## Где менять тексты

### Главные данные (имя, описание, контакты, статистика)
→ [src/config.ts](src/config.ts)

```ts
export const CONFIG = {
  name:        "Оксана Миру",           // Имя психолога
  title:       "Психолог и гипнолог",   // Должность (курсивом на Hero)
  description: "...",                   // Подзаголовок на Hero
  whatsapp:    "https://wa.me/...",     // Номер WhatsApp
  telegram:    "https://t.me/...",      // Ник в Telegram
  instagram:   "https://instagram.com/...",
  stats: {
    hours: "500+",            // Часы практики
    confidentiality: "100%",  // Конфиденциальность
  }
}
```

### Тексты секций, отзывы, FAQ, методика
→ [src/App.tsx](src/App.tsx)

Каждая секция помечена комментарием `{/* ── Название ─── */}`.
Ищи нужную секцию и меняй тексты в JSX.

### Тексты квиза (вопросы и результаты)
→ [src/components/Quiz.tsx](src/components/Quiz.tsx)

```ts
const questions = [...];  // Вопросы квиза
const results   = [...];  // Тексты результатов
```

### Все тексты в одном месте (для редактирования вне кода)
→ [content.md](content.md)

---

## Где менять изображения

### Фото психолога
1. Положи фото в `assets/images/`
2. Открой [src/config.ts](src/config.ts)
3. Замени URL:

```ts
images: {
  hero:  "/assets/images/hero.jpg",   // Фото на первом экране
  about: "/assets/images/about.jpg",  // Фото в блоке «Обо мне»
}
```

### Фото дипломов
1. Положи фото в `assets/images/diplomas/`
2. Открой [src/App.tsx](src/App.tsx)
3. Найди секцию `diplomas` и замени поле `img`:

```ts
{ year: '2004', title: 'Педагогическое...', school: 'НПУ...', img: '/assets/images/diplomas/diploma-2004.jpg' }
```

### OG-изображение (для соцсетей)
→ `assets/images/og-image.jpg` (1200×630px)

---

## Где менять ссылки и контакты

Все контакты в одном месте → [src/config.ts](src/config.ts):

```ts
whatsapp:  "https://wa.me/32467810422",  // Формат: wa.me/КОД_СТРАНЫ_НОМЕР
telegram:  "https://t.me/psyfusions",
instagram: "https://instagram.com/psyfusions",
```

---

## Где редактировать квиз

→ [src/components/Quiz.tsx](src/components/Quiz.tsx)

### Добавить вопрос
```ts
const questions = [
  // ... существующие вопросы
  {
    id: 8,
    text: "Ваш новый вопрос?",
    options: ["вариант 1", "вариант 2", "вариант 3", "вариант 4"]
  }
];
```

### Изменить пороги результатов
```ts
const getResult = () => {
  if (score <= 7)  return results[0];  // Низкий — меняй число
  if (score <= 14) return results[1];  // Средний — меняй число
  return results[2];                    // Высокий
};
```

### Изменить тексты результатов
```ts
const results = [
  { title: "Низкий уровень тревожности",  desc: "..." },
  { title: "Средний уровень тревожности", desc: "..." },
  { title: "Высокий уровень тревожности", desc: "..." },
];
```

---

## Где редактировать форму

→ [src/App.tsx](src/App.tsx) — секция `contact`

Поля формы — `<input name="..." />` с атрибутом `name`.
Данные отправляются на `/api/contact` (обрабатывает [server.ts](server.ts)).

### Подключить реальную отправку заявок
Открой [server.ts](server.ts), найди `/api/contact` и добавь:

**Вариант 1 — Telegram Bot:**
```ts
// Установить: npm install node-fetch
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

const text = `Новая заявка!\nИмя: ${name}\nКонтакт: ${contact}\nЗапрос: ${message}`;
await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text })
});
```

**Вариант 2 — Email через nodemailer:**
```ts
// Установить: npm install nodemailer
```

---

## Основные файлы

| Файл | Назначение |
|------|-----------|
| [src/config.ts](src/config.ts) | Все настройки сайта (имя, контакты, фото) |
| [src/App.tsx](src/App.tsx) | Весь лендинг (12 секций) |
| [src/components/Quiz.tsx](src/components/Quiz.tsx) | Квиз-диагностика |
| [src/index.css](src/index.css) | Tailwind + цветовые переменные |
| [styles.css](styles.css) | CSS переменные (справочник цветов) |
| [index.html](index.html) | HTML-шаблон с SEO мета-тегами |
| [server.ts](server.ts) | Express сервер (API форм) |
| [.env.example](.env.example) | Шаблон переменных окружения |

---

## Сборка для production

```bash
npm run build     # Собирает React в /dist
npm run dev       # В production режиме раздаёт /dist
```

Или деплой на Vercel/Railway/VPS — проект готов к деплою как Node.js приложение.

---

## Дополнительная документация

- [brief.md](brief.md) — клиент, задача, аудитория
- [research.md](research.md) — анализ и рекомендации
- [PLAN.md](PLAN.md) — план доработки
- [project.md](project.md) — техническое описание
- [content.md](content.md) — все тексты сайта
- [structure.md](structure.md) — структура лендинга
- [CLAUDE.md](CLAUDE.md) — инструкции для Claude Code
