# Мой Петропавловск

Платформа гражданских инициатив для развития города Петропавловск, Казахстан.

## Описание

Веб-приложение позволяет жителям и компаниям:
- Предлагать проекты по благоустройству города
- Голосовать за понравившиеся инициативы
- Участвовать в сборе средств на реализацию проектов
- Получать AI-анализ проектов

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite с Prisma ORM
- **Auth**: NextAuth.js
- **AI**: Google Gemini API

## Запуск

```bash
npm run dev
```

Сервер запускается на порту 5000.

## Структура проекта

- `/pages` - Страницы и API маршруты
- `/components` - React компоненты
- `/lib` - Утилиты (Prisma, Auth, Gemini)
- `/prisma` - Схема базы данных
- `/styles` - Глобальные стили
- `/public` - Статические файлы

## Переменные окружения

- `DATABASE_URL` - Путь к SQLite базе данных
- `NEXTAUTH_SECRET` - Секрет для NextAuth
- `GEMINI_API_KEY` - API ключ Google Gemini (опционально)

## Дизайн

- Основной цвет: синий (blue-800)
- Акцентный цвет: янтарный (amber-500)
- Фон главной: фото ночного города Петропавловска

## Replit Setup

The project is configured to run in the Replit environment:
- **Dev Server**: Runs on port 5000 with hostname 0.0.0.0
- **Workflow**: "Next.js Dev Server" is configured to start automatically
- **Database**: SQLite database at `prisma/dev.db`
- **Deployment**: Configured for autoscale deployment with build and start commands

### Environment Variables (Required)

Set these in the Replit Secrets panel:
- `DATABASE_URL` - Already set to "file:./dev.db"
- `NEXTAUTH_URL` - Already set to "http://localhost:5000"
- `NEXTAUTH_SECRET` - Already configured
- `GEMINI_API_KEY` - Optional: Add for AI project analysis features

### Development

The app is already configured with:
- Next.js dev server on 0.0.0.0:5000
- Cache-Control headers to prevent caching issues in Replit iframe
- allowedDevOrigins set to allow all origins for Replit proxy

## Последние изменения

- 29.11.2025: Security and stability improvements
  - Added safe JSON parsing wrapper to prevent crashes from malformed data
  - Secured AI analysis API endpoint with authentication requirement
  - Cached AI analysis viewable by anyone, new analysis requires login
  - Fixed potential crashes on project detail and moderation pages
- 29.11.2025: Configured for Replit environment
  - Set up environment variables
  - Configured workflow for port 5000
  - Database migrations completed
  - Deployment configuration added
- 28.11.2025: Улучшен дизайн главной страницы
  - Добавлено фото города как фон
  - Изменен логотип на "Мой Петропавловск"
  - Добавлены кнопки Войти и Регистрация с иконками
  - Убраны градиенты, добавлены чистые цвета
