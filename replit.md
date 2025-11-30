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

### AI-чат по проектам
- После анализа проекта можно задавать вопросы AI
- Чат понимает контекст конкретного проекта
- История разговора сохраняется в рамках сессии
- Доступен во вкладке "Задать вопрос" в модальном окне AI-анализа

### Административные функции
- Роли MODERATOR и ADMIN могут:
  - Удалять проекты (с каскадным удалением голосов, комментариев, вкладов)
  - Одобрять/отклонять комментарии
  - Удалять комментарии
- Админы видят все комментарии (включая неодобренные)
- Учётная запись модератора: admin@email.com / admin123
- Админ создаётся автоматически при запуске приложения (см. lib/prisma.ts)

### Управление периодами (подача/голосование)
- Администратор может создавать периоды подачи проектов и голосования
- Периоды имеют даты начала и окончания
- Возможность досрочно завершить период
- Баннер объявлений показывает активный период на всех страницах
- Проекты можно подавать только в период подачи
- Голосовать можно только в период голосования

### Сортировка проектов
- Проекты сортируются по популярности (количество голосов "за")
- Альтернативная сортировка по дате создания
- Переключатель сортировки на странице проектов

### Мои проекты
- В профиле пользователя отображается раздел "Мои проекты"
- Возможность удаления черновиков, проектов на модерации, отклонённых или завершённых
- Активные проекты (одобренные, на голосовании, на сборе средств, в работе) удалить нельзя

## Последние изменения

- 29.11.2025: **Period Management & Project Features**
  - Added Period model for submission/voting periods
  - API endpoints for period management (create, update, end early)
  - Announcement banner showing active period on all pages
  - Project sorting by votes (popularity) and by date
  - "My Projects" section in user profile with delete functionality
  - Delete restrictions: only DRAFT, PENDING_MODERATION, REJECTED, COMPLETED can be deleted

- 30.11.2025: **Fresh GitHub Import Completed**
  - Re-imported from GitHub and configured for Replit environment
  - Installed all npm dependencies (Next.js 15.2.3, React 19, Prisma 5.22.0, etc.)
  - Set up environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
  - Configured Next.js Dev Server workflow on port 5000 with webview output
  - Generated Prisma client and verified database connectivity
  - Configured autoscale deployment with build and start commands
  - Created .gitignore for proper file exclusion
  - Verified app is running correctly with existing SQLite database and all features
  
- 29.11.2025: **GitHub Import Setup Completed**
  - Fresh clone imported and configured for Replit environment
  - Installed all npm dependencies (Next.js 15.5.6, React 19, Prisma 5.22.0, etc.)
  - Set up environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
  - Configured Next.js Dev Server workflow on port 5000 with webview output
  - Generated Prisma client and verified database connectivity
  - Configured autoscale deployment with build and start commands
  - Created .gitignore for proper file exclusion
  - Verified app is running correctly with existing SQLite database and all features

- Previous features include:
  - Admin controls for project/comment moderation
  - AI chat for project questions
  - Company subscription system
  - AI budget estimation
  - Leaflet map with project markers
  - Image upload for projects
