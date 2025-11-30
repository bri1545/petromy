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

### Политика модерации
- Новая страница `/policy` с описанием правил модерации
- Критерии одобрения проектов (полнота, реалистичность, польза, безопасность)
- Причины отклонения проектов
- Описание команды модераторов (эксперты, представители акимата, активисты, AI)
- Процесс проверки проектов (подача → AI-анализ → модерация → решение)
- Информация об AI-модерации комментариев
- Ссылка в навигации и футере

### Чат поддержки (Support Chat)
- Плавающая кнопка чата в правом нижнем углу всех страниц
- AI-помощник отвечает на вопросы о платформе
- Быстрые вопросы для быстрого доступа
- Автоматическая эскалация жалоб и сложных вопросов администратору
- Категоризация обращений (проекты, голосование, аккаунт, жалобы и т.д.)
- Панель администратора для ответов на обращения (`/support`)
- Пользователи получают ответы админа в реальном времени (polling)
- Ссылка на поддержку в админ-меню навигации

## Последние изменения

- 30.11.2025: **Чат поддержки с AI**
  - Добавлен плавающий чат поддержки на всех страницах
  - AI-помощник отвечает на вопросы о платформе
  - Автоматическая эскалация жалоб администратору
  - Панель администратора для управления обращениями
  - Модели SupportTicket и SupportMessage в базе данных
  - Polling для получения ответов администратора в реальном времени

- 30.11.2025: **Страница политики модерации**
  - Создана красивая страница `/policy` с политикой модерации
  - Добавлены секции: процесс модерации, критерии одобрения, причины отклонения
  - Описание команды модераторов с иконками
  - Ссылка добавлена в навигацию и футер
  - Градиентный hero-раздел с иконкой щита

- 29.11.2025: **Period Management & Project Features**
  - Added Period model for submission/voting periods
  - API endpoints for period management (create, update, end early)
  - Announcement banner showing active period on all pages
  - Project sorting by votes (popularity) and by date
  - "My Projects" section in user profile with delete functionality
  - Delete restrictions: only DRAFT, PENDING_MODERATION, REJECTED, COMPLETED can be deleted

- 30.11.2025: **Fresh GitHub Import Setup Completed (Latest)**
  - Fresh clone from GitHub successfully imported and configured for Replit
  - Installed all npm dependencies (373 packages including Next.js 15.5.6, React 19, Prisma 5.22.0)
  - Set up environment variables (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET)
  - Generated Prisma client for database access
  - Configured Next.js Dev Server workflow on port 5000 with 0.0.0.0 binding and webview output
  - Updated next.config.ts with experimental allowedOrigins for Replit proxy support
  - Configured autoscale deployment (build: npm run build, run: npm run start)
  - Created comprehensive .gitignore for Node.js, Next.js, Prisma, and uploads
  - Verified app is fully functional with existing SQLite database
  - All features working: authentication, projects, voting, AI analysis, support chat, admin panel
  - Homepage loads correctly with city background and Russian UI

- Previous features include:
  - Admin controls for project/comment moderation
  - AI chat for project questions
  - Company subscription system
  - AI budget estimation
  - Leaflet map with project markers
  - Image upload for projects
