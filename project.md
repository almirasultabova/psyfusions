# project.md — PsyFusions

## Текущее состояние проекта

Лендинг полностью структурирован и готов к разработке. Исходники перенесены из Google AI Studio в организованную структуру в корне проекта.

**Статус:** Готов к наполнению реальным контентом и подключению бэкенда.

---

## Файловая структура

```
psyfusions/
├── AI-google-studio/          ← Оригинал из Google AI Studio (архив, не трогать)
│
├── src/                       ← React источники (основная работа здесь)
│   ├── App.tsx                ← Весь лендинг (12 секций + модалки)
│   ├── main.tsx               ← Точка входа React (не менять)
│   ├── config.ts              ← ВСЕ настройки: имя, контакты, фото, статистика
│   ├── index.css              ← Tailwind директивы + CSS переменные
│   └── components/
│       └── Quiz.tsx           ← Квиз-диагностика тревожности (7 вопросов)
│
├── assets/
│   ├── images/                ← Фото психолога, дипломы, OG-image
│   ├── icons/                 ← Favicon и SVG иконки
│   └── fonts/                 ← Кастомные шрифты (если нужны)
│
├── index.html                 ← HTML-шаблон с мета-тегами и SEO
├── styles.css                 ← CSS переменные и глобальные стили (справочник)
├── script.js                  ← JS утилиты и документация логики
├── package.json               ← Зависимости npm
├── vite.config.ts             ← Конфигурация Vite
├── tsconfig.json              ← TypeScript конфигурация
├── server.ts                  ← Express сервер (API /api/contact)
├── .env.example               ← Шаблон переменных окружения
├── .gitignore
│
├── brief.md                   ← Бриф: клиент, задача, аудитория
├── research.md                ← Анализ: сильные/слабые стороны, рекомендации
├── PLAN.md                    ← Пошаговый план доработки
├── project.md                 ← Этот файл: описание проекта
├── CLAUDE.md                  ← Инструкции для Claude Code
├── content.md                 ← Все тексты сайта по блокам
├── structure.md               ← Структура лендинга по секциям
└── README.md                  ← Руководство по запуску и редактированию
```

---

## Зависимости

### Производственные (dependencies)
| Пакет | Версия | Назначение |
|-------|--------|-----------|
| react | ^19.0.0 | UI фреймворк |
| react-dom | ^19.0.0 | Рендеринг React в DOM |
| motion | ^12.x | Анимации (Framer Motion) |
| lucide-react | ^0.546.0 | SVG иконки |
| tailwind-merge | ^3.x | Утилита для Tailwind классов |
| clsx | ^2.x | Условные CSS классы |
| express | ^4.x | HTTP сервер для API |
| dotenv | ^17.x | Переменные окружения |
| @google/genai | ^1.x | Google AI (не используется в коде, можно удалить) |

### Инструменты сборки (devDependencies)
| Пакет | Версия | Назначение |
|-------|--------|-----------|
| vite | ^6.x | Сборщик, dev-server |
| @vitejs/plugin-react | ^5.x | React поддержка в Vite |
| tailwindcss | ^4.x | CSS фреймворк |
| @tailwindcss/vite | ^4.x | Tailwind плагин для Vite |
| typescript | ~5.8.x | TypeScript компилятор |
| tsx | ^4.x | TypeScript executor (для server.ts) |

---

## Как работает проект

### Режим разработки
```bash
npm install
npm run dev     # → запускает Express + Vite на http://localhost:3000
```

Сервер (`server.ts`) запускает:
1. Express с API роутами (`/api/contact`)
2. Vite в middleware-режиме (HMR, React Fast Refresh)

### Сборка для production
```bash
npm run build   # → собирает React в /dist
npm run dev     # → Express раздаёт /dist статику
```

### API эндпоинты
| Метод | URL | Описание |
|-------|-----|----------|
| POST | `/api/contact` | Обработка заявок с форм и квиза |

**Тело запроса:**
```json
{
  "name": "Имя клиента",
  "contact": "Телефон или мессенджер",
  "message": "Краткий запрос (опционально)",
  "source": "Main Contact Form | Quiz Form",
  "score": 12,        // только для квиза
  "result": "Средний уровень тревожности" // только для квиза
}
```

**Текущее поведение:** только `console.log` → нужно подключить реальную отправку (см. PLAN.md).

---

## Переменные окружения

Создать файл `.env` на основе `.env.example`:

```
TELEGRAM_BOT_TOKEN=   # Токен Telegram бота для уведомлений
TELEGRAM_CHAT_ID=     # ID чата/канала куда слать заявки
GEMINI_API_KEY=       # Google AI ключ (не используется сейчас)
```

---

## Цветовая схема

| Переменная | Hex | Использование |
|-----------|-----|--------------|
| `brand-primary` | `#3D4435` | Текст заголовков, кнопки, навигация |
| `brand-secondary` | `#F4F5F0` | Фоны карточек, hover-состояния |
| `brand-accent` | `#BC6C25` | Акценты, CTA, иконки |
| `brand-paper` | `#FDFCF9` | Основной фон страницы |
| `brand-ink` | `#1C1F1A` | Основной текст |
