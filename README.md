# Менеджер Завдань

Веб-застосунок для управління завданнями з використанням HTTP-запитів та RESTful API.
Побудований на **Next.js (App Router) + TypeScript + React**.

## Опис проєкту

Цей застосунок створено як частину лабораторної роботи №7 "Використання HTTP-запитів". Він демонструє роботу з:
- HTTP-запитами через Fetch API
- RESTful API (JSONPlaceholder)
- Пагінацією даних
- Кешуванням запитів
- Локальним збереженням стану

## Функціональність

### Основні можливості

- 📋 Перегляд списку завдань з пагінацією
- ➕ Додавання нових завдань
- ✏️ Редагування існуючих завдань
- ✅ Позначення завдань як виконаних
- 🗑️ Видалення завдань
- 💾 Автоматичне збереження стану
- 🔄 Кешування для оптимізації запитів

## Структура файлів

```
task-manager/
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Кореневий layout, метадані
│   │   ├── page.tsx              # Головна сторінка
│   │   └── globals.css           # Стилі застосунку
│   ├── components/
│   │   ├── TaskManager.tsx       # Контейнер: форма + список + пагінація
│   │   ├── CreateTaskForm.tsx    # Форма створення завдання
│   │   ├── TaskItem.tsx          # Один елемент списку
│   │   ├── Pagination.tsx        # Кнопки "Назад" / "Вперед"
│   │   └── Notifications.tsx     # Анімовані сповіщення
│   ├── hooks/
│   │   ├── useTasks.ts           # Стан завдань і CRUD-операції
│   │   ├── usePersistedPage.ts   # Поточна сторінка + LocalStorage
│   │   └── useNotifications.tsx  # Контекст сповіщень
│   ├── lib/
│   │   └── api.ts                # HTTP-запити, кешування
│   └── types/
│       └── task.ts               # Типи Task, NewTask, TaskUpdate...
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Модулі

### src/lib/api.ts

Модуль для роботи з HTTP-запитами та API (типізований).

```typescript
getTasks(page?: number, limit?: number): Promise<Task[]>
createTask(task: NewTask): Promise<Task>
updateTask(id: number, updates: TaskUpdate): Promise<Task>
deleteTask(id: number): Promise<true>
bulkUpdate(ids: number[], updates: TaskUpdate): Promise<Task[]>
setAuthToken(token: string | null): void
clearCache(): void
getCacheSize(): number
```

**Особливості:**
- Кешування запитів через `Map<string, Task[]>`
- Автоматична перевірка статусу відповіді (`HttpError` зі `status`/`statusText`)
- Підтримка авторизації через токен
- Обробка помилок

### src/hooks

- **`useTasks(page)`** — завантажує завдання поточної сторінки (ігноруючи застарілі
  відповіді), надає `addTask`, `toggleTask` (оптимістичне оновлення з відкатом),
  `renameTask`, `removeTask` (з анімацією зникнення).
- **`usePersistedPage()`** — номер сторінки, що відновлюється з LocalStorage після
  монтування (без помилок гідратації SSR).
- **`useNotifications()`** — контекст для показу сповіщень `notify(message, type)`.

### src/components

Інтерфейс розбитий на клієнтські React-компоненти (`'use client'`); сторінка
`src/app/page.tsx` рендериться статично і гідратується в браузері.

## API

Використовується публічний API **JSONPlaceholder**:
```
https://jsonplaceholder.typicode.com/todos
```

### Приклади запитів

#### GET - Отримати завдання
```javascript
// Отримати 10 завдань зі сторінки 1
GET /todos?_page=1&_limit=10
```

#### POST - Створити завдання
```javascript
POST /todos
Content-Type: application/json

{
  "title": "Нове завдання",
  "completed": false,
  "userId": 1
}
```

#### PATCH - Оновити завдання
```javascript
PATCH /todos/1
Content-Type: application/json

{
  "completed": true
}
```

#### DELETE - Видалити завдання
```javascript
DELETE /todos/1
```

## Кешування

Реалізовано простий механізм кешування:

```javascript
// Структура кешу
cache: Map {
  'tasks_1_10' => [...tasks],
  'tasks_2_10' => [...tasks]
}

// Очищення при модифікації
createTask() -> cache.clear()
updateTask() -> cache.clear()
deleteTask() -> cache.clear()
```

## LocalStorage

Зберігається:
- Номер поточної сторінки

```javascript
// Збереження
localStorage.setItem('currentPage', pageNumber);

// Відновлення
const page = localStorage.getItem('currentPage');
```

## Запуск проєкту

Потрібен Node.js >= 20.9.

```bash
npm install

# Режим розробки (Fast Refresh) — http://localhost:3000
npm run dev

# Продакшн-збірка та запуск
npm run build
npm start

# Перевірка типів
npm run typecheck
```

## Обробка помилок

### Перевірка відповіді

```typescript
function checkResponse(response: Response): Response {
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }
  return response;
}
```

### Try-Catch блоки

Всі HTTP-запити обгорнуті в try-catch:

```typescript
try {
  const newTask = await createTask({ title, completed: false, userId: 1 });
  setTasks((list) => [toEntry(newTask, true), ...list]);
} catch (error) {
  notify(`Помилка створення: ${getErrorMessage(error)}`, 'error');
}
```

## Пагінація

- По 10 завдань на сторінку
- Кнопки навігації "Назад" / "Вперед"
- Вимикання кнопки "Назад" на першій сторінці
- Вимикання кнопки "Вперед", якщо сторінка неповна
- Збереження поточної сторінки

## Стилі

- Адаптивний дизайн
- Градієнтні кнопки
- Плавні анімації
- Hover ефекти
- Мобільна версія

## Контрольні запитання

1. **Що таке стартовий рядок у HTTP‑запиті?**
   - Містить метод, URL та версію протоколу

2. **Різниця між POST і PUT?**
   - POST створює новий ресурс
   - PUT повністю замінює існуючий

3. **Що робить Promise.all()?**
   - Виконує кілька промісів паралельно
   - Повертає масив результатів або першу помилку

4. **Навіщо Content-Type?**
   - Вказує тип даних у тілі запиту
   - Наприклад: `application/json`, `multipart/form-data`

5. **Що таке CORS?**
   - Cross-Origin Resource Sharing
   - Механізм безпеки для міждоменних запитів

## Додаткові можливості

### Групове оновлення

```javascript
// Позначити кілька завдань як виконані
const ids = [1, 2, 3];
const results = await bulkUpdate(ids, { completed: true });
```

### Авторизація

```javascript
import { setAuthToken } from '@/lib/api';

// Встановити токен
setAuthToken('your-token-here');

// Усі наступні запити матимуть заголовок:
// Authorization: Bearer your-token-here
```

### Очищення кешу

```javascript
import { clearCache, getCacheSize } from '@/lib/api';

console.log('Cache size:', getCacheSize());
clearCache();
```

## Відомі обмеження

1. JSONPlaceholder - це тестовий API:
   - POST/PATCH/DELETE не зберігають зміни
   - Повертає фейкові дані
   - Обмежена кількість записів

2. Кеш очищається при будь-якій модифікації
   - Для продакшену потрібна складніша логіка

3. LocalStorage зберігає тільки номер сторінки
   - Можна розширити для збереження фільтрів

## Подальші покращення

- [ ] Фільтрація (виконані/активні/всі)
- [ ] Пошук за назвою
- [ ] Сортування
- [ ] Повторні спроби при помилках
- [ ] Оффлайн режим
- [ ] Unit тести

> JSONPlaceholder повертає `id: 201` для кожного створеного завдання, тому в UI
> для React-ключів використовується окремий локальний ключ.

## Технології

- Next.js 16 (App Router)
- React 19
- TypeScript (strict)
- Fetch API
- LocalStorage API
- CSS3

## Авторизація

```javascript
import { setAuthToken } from '@/lib/api';

// Встановити токен
setAuthToken('your-token-here');

// Усі наступні запити матимуть заголовок:
// Authorization: Bearer your-token-here
```

### Очищення кешу

```javascript
import { clearCache, getCacheSize } from '@/lib/api';

console.log('Cache size:', getCacheSize());
clearCache();
```

## Відомі обмеження

1. JSONPlaceholder - це тестовий API:
   - POST/PATCH/DELETE не зберігають зміни
   - Повертає фейкові дані
   - Обмежена кількість записів

2. Кеш очищається при будь-якій модифікації
   - Для продакшену потрібна складніша логіка

3. LocalStorage зберігає тільки номер сторінки
   - Можна розширити для збереження фільтрів

## Подальші покращення

- [ ] Фільтрація (виконані/активні/всі)
- [ ] Пошук за назвою
- [ ] Сортування
- [ ] Повторні спроби при помилках
- [ ] Оффлайн режим
- [ ] Unit тести

> JSONPlaceholder повертає `id: 201` для кожного створеного завдання, тому в UI
> для React-ключів використовується окремий локальний ключ.

## Технології

- JavaScript (ES6+)
- Fetch API
- ES Modules
- LocalStorage API
- CSS3
- HTML5

## Автор

Виконано як лабораторна робота №7 з курсу ООРВЗ

## Ліцензія

MIT
