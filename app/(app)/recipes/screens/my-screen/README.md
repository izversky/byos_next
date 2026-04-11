# My Screen

Экран отображения крипто-валют, погоды и задач из Google Tasks с интеграцией CoinGecko, Open-Meteo API и Google Tasks API.

## 📁 Структура проекта

```
my-screen/
├── components/           # React компоненты
│   ├── weather-icon.tsx  # Компонент выбора иконки погоды
│   ├── crypto-item.tsx   # Компонент отдельной крипто-цены
│   └── tasks-list.tsx    # Компонент списка задач из Google Tasks
├── utils/                # Утилиты и вспомогательные функции
│   ├── constants.ts      # Константы, конфигурация, API URLs
│   ├── formatters.ts     # Функции форматирования данных
│   ├── weather-utils.ts  # Утилиты для работы с API погоды
│   └── tasks-utils.ts    # Утилиты для работы с Google Tasks API
├── types.ts              # TypeScript интерфейсы и типы
├── getData.ts            # Server Action для получения данных
├── icons.tsx             # SVG иконки монет и погоды
└── my-screen.tsx         # Основной компонент экрана
```

## 🎯 Назначение файлов

### `/components`

**React компоненты** для отдельных элементов экрана

- `weather-icon.tsx` - Выбирает подходящую иконку погоды по описанию
- `crypto-item.tsx` - Отображает цену одной монеты с изменением за 24ч
- `tasks-list.tsx` - Отображает список задач из Google Tasks (активные и завершённые)

### `/utils`

**Утилиты и служебные функции**

- `constants.ts` - Конфигурация: API URLs, таймауты, дефолтные значения
- `formatters.ts` - Форматирование: цены, проценты, даты/время
- `weather-utils.ts` - Работа с Open-Meteo: геокодирование, запросы, парсинг
- `tasks-utils.ts` - Работа с Google Tasks API: получение списков и задач

### Корневые файлы

- `types.ts` - Централизованные TypeScript типы и интерфейсы
- `getData.ts` - Server Action для загрузки крипто-данных, погоды и задач
- `icons.tsx` - Все SVG иконки (крипто и погода)
- `my-screen.tsx` - Главный компонент экрана

## 🔄 Поток данных

```
getData.ts (Server Action)
    ├── utils/constants.ts (конфигурация)
    ├── utils/weather-utils.ts (API запросы погоды)
    ├── utils/tasks-utils.ts (API запросы задач)
    └── types.ts (типизация)
           ↓
       my-screen.tsx (основной компонент)
           ├── components/weather-icon.tsx
           ├── components/crypto-item.tsx
           ├── components/tasks-list.tsx (новое)
           ├── utils/formatters.ts
           └── icons.tsx
```

## 🔐 Google Tasks интеграция

### Установка

1. **Получить Google OAuth токен**
   - Перейти на https://console.cloud.google.com/
   - Создать новый проект
   - Включить Google Tasks API
   - Создать OAuth 2.0 credentials (Desktop application)
   - Получить Access Token

2. **Установить переменную окружения**

   ```bash
   # В .env.local или .env
   GOOGLE_TASKS_ACCESS_TOKEN=your_access_token_here
   ```

3. **Использование**
   - Компонент автоматически получает задачи из Google Tasks
   - Отображаются активные и завершённые задачи
   - Максимум 10 последних задач из первого списка ("My Tasks")

### Как обновить токен

Google AccessToken имеют срок действия. Для обновления:

- Используйте Refresh Token для получения нового Access Token
- Или перечитайте шаги установки выше

## 📦 Dependencies

- **Open-Meteo API** - Бесплатная API для погоды
- **CoinGecko API** - Бесплатная API для крипто-цен
- **Google Tasks API** - API для работы с задачами
- **React/Next.js** - Framework
- **PreSatori** - Рендеринг UI для e-ink дисплеев

## 🔧 Возможные улучшения

- [ ] Добавить кэширование на уровне компонента
- [ ] Экстрактировать магические строки в константы
- [ ] Добавить unit тесты для utils
- [ ] Локализацию UI (i18n)
- [ ] Конфигурируемый список монет
- [ ] Выбор локации через UI
- [ ] Поддержка разных списков Google Tasks
- [ ] Пагинация для большого количества задач
- [ ] Фильтрация по датам (только сегодняшние задачи и т.д.)

## 📝 Заметки по разработке

- Все API запросы имеют таймаут 4 сек для предотвращения зависания UI
- При ошибке API используется последний кэшированный результат (graceful degradation)
- Форматирование данных отделено для переиспользования
- Компоненты чистые и не имеют зависимостей друг от друга
