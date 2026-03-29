# 🚀 Google Tasks Setup Guide

## Краткая инструкция по подключению Google Tasks

### Шаг 1: Получить Access Token

#### Способ 1: Через Google Cloud Console (Рекомендуется)

1. Перейти на https://console.cloud.google.com/
2. Создать новый проект:
   - Нажать "Select a project" → "NEW PROJECT"
   - Дать проекту имя (например, "BYOS Tasks")
3. Включить Google Tasks API:
   - В поиске ввести "Google Tasks API"
   - Нажать "Enable"
4. Создать OAuth 2.0 Credentials:
   - Перейти в "Credentials"
   - Нажать "Create Credentials" → "OAuth client ID"
   - Выбрать "Desktop application"
   - Нажать "Create"
   - Скопировать Client ID и Client Secret
5. Получить Access Token через OAuth Playground:
   - Перейти на https://developers.google.com/oauthplayground
   - В настройках (шестерёнка) включить "Use your own OAuth credentials"
   - Вставить Client ID и Client Secret
   - В левой части найти "Google Tasks API v1"
   - Выбрать нужный scope (например https://www.googleapis.com/auth/tasks)
   - Нажать "Authorize APIs"
   - На шаге 2 нажать "Exchange authorization code for tokens"
   - Скопировать "Access token"

#### Способ 2: Быстро через curl

```bash
# После получения Client ID, Client Secret и Authorization Code:
curl -X POST https://oauth2.googleapis.com/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=AUTHORIZATION_CODE \
  -d grant_type=authorization_code \
  -d redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

### Шаг 2: Добавить токен в проект

1. Открыть файл `.env.local` в корне проекта
2. Добавить строку:
   ```
   GOOGLE_TASKS_ACCESS_TOKEN=your_access_token_here
   ```
3. Сохранить файл

### Шаг 3: Проверить

- Перезагрузить приложение
- Виджет "My Screen" должен отобразить ваши задачи из Google Tasks

## 📋 Что отображается

- **Активные задачи** (не завершённые)
  - Группируются в отдельной секции
  - Показывает количество активных задач
  - Отображает дату выполнения, если указана

- **Завершённые задачи**
  - Показываются ниже активных
  - Зачёркнутый текст
  - Показывает количество завершённых

- **Максимум 10 последних задач** из первого списка ("My Tasks")

## ⚠️ Важно

- **Access Token имеет срок действия** (обычно 3600 секунд / 1 час)
- Для долгосрочного использования нужно реализовать refresh токена
- Если видите "Нет задач" - проверьте:
  - Правильность токена
  - Наличие задач в Google Tasks
  - Включен ли Google Tasks API в Google Cloud Console

## 🔧 Обновление токена (долгосрочное решение)

Если нужен долгосрочный доступ, реализуйте Refresh Token:

1. При первой аутентификации сохранить Refresh Token
2. Когда Access Token истекает, использовать Refresh Token:
   ```bash
   curl -X POST https://oauth2.googleapis.com/token \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET \
     -d refresh_token=YOUR_REFRESH_TOKEN \
     -d grant_type=refresh_token
   ```
3. Использовать новый Access Token

## 📝 Заметки

- Токен хранится в `.env.local` и не попадает в git
- Для приватности используйте разные токены для разных окружений
- Не делитесь Access Token с другими людьми
