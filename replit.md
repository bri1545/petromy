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

## Новые функции

### Подписка для компаний
- Компании должны иметь активную подписку для подачи проектов и голосования
- Варианты подписки: 1 месяц, 3 месяца, 6 месяцев, 1 год
- Страница подписки: `/subscription`
- Заглушка оплаты (нажал "Купить" - подписка активирована)

### AI-оценка бюджета
- Бюджет проекта автоматически оценивается AI (Gemini)
- Пользователю не нужно указывать бюджет вручную
- Оценка сохраняется в поле `aiEstimatedBudget`

### Карта проектов (Leaflet)
- На странице проектов есть переключатель Список/Карта
- Проекты с координатами отображаются на карте маркерами
- Цвет маркера зависит от категории проекта

### Загрузка изображений
- При подаче проекта можно загрузить изображение
- Поддержка PNG, JPG до 5MB
- Изображения сохраняются в `/public/uploads/`

### Улучшенные комментарии
- Минимум 3 символа (вместо 20)
- Автоматическое одобрение при отсутствии GEMINI_API_KEY

## Последние изменения

- 29.11.2025: **Major Feature Update**
  - Added company subscription system with 4 plan durations
  - AI now estimates project budget automatically
  - Added Leaflet map with project markers
  - Added image upload for projects
  - Reduced minimum character limits for projects and comments
  - Companies require subscription for project submission and voting
- 29.11.2025: **GitHub Import Completed** - Configured for Replit environment
  - Installed all npm dependencies (Next.js 15.5.6, React 19, Prisma, etc.)
  - Set up environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
  - Configured Next.js Dev Server workflow on port 5000 with webview
  - Generated Prisma client and verified database schema
  - Configured autoscale deployment with build and start commands
- Previous history: Security improvements, AI analysis features, design enhancements
