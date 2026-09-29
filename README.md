# Менеджер Завдань

Веб-застосунок для управління завданнями з використанням HTTP-запитів та RESTful API.

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
├── index.html           # HTML структура
├── styles.css           # Стилі застосунку
├── src/
│   ├── main.js         # Ініціалізація
│   ├── api.js          # HTTP-запити
│   └── ui.js           # Управління DOM
└── README.md           # Документація
```

## Модулі

### src/api.js

Модуль для роботи з HTTP-запитами та API.

**Основні функції:**

```javascript
getTasks(page, limit)    // Отримати завдання
createTask(task)         // Створити завдання
updateTask(id, updates)  // Оновити завдання
deleteTask(id)           // Видалити завдання
bulkUpdate(ids, updates) // Групове оновлення
```

**Особливості:**
- Кешування запитів через Map
- Автоматична перевірка статусу відповіді
- Підтримка авторизації через токен
- Обробка помилок

### src/ui.js

Модуль для управління інтерфейсом користувача.

**Основні функції:**

```javascript
renderTasks(tasks)           // Рендеринг списку
updateTasksDisplay(page)     // Оновлення відображення
handleCreateTask(event)      // Обробка створення
handlePagination(direction)  // Керування пагінацією
showNotification(msg, type)  // Показ сповіщень
```

**Особливості:**
- Динамічне оновлення DOM
- Обробка подій (checkbox, кнопки)
- Збереження стану в LocalStorage
- Анімовані сповіщення

### src/main.js

Точка входу застосунку.

**Функції:**
- Ініціалізація при завантаженні DOM
- Підключення обробників подій
- Відновлення збереженого стану

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

### Варіант 1: Відкриття файлу

Просто відкрийте `index.html` у браузері

### Варіант 2: Live Server (VS Code)

1. Встановіть розширення "Live Server"
2. Клацніть правою кнопкою на `index.html`
3. Оберіть "Open with Live Server"

### Варіант 3: Статичний сервер

```bash
# Використання npx serve
npx serve .

# Або Python
python -m http.server 8000

# Або Node.js http-server
npx http-server
```

## Обробка помилок

### Перевірка відповіді

```javascript
function checkResponse(response) {
  if (!response.ok) {
    const error = new Error(`HTTP Error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response;
}
```

### Try-Catch блоки

Всі HTTP-запити обгорнуті в try-catch:

```javascript
try {
  const tasks = await getTasks(page);
  renderTasks(tasks);
} catch (error) {
  console.error('Error:', error);
  showNotification(`Помилка: ${error.message}`, 'error');
}
```

## Пагінація

- По 10 завдань на сторінку
- Кнопки навігації "Назад" / "Вперед"
- Вимикання кнопки "Назад" на першій сторінці
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
import { setAuthToken } from './api.js';

// Встановити токен
setAuthToken('your-token-here');

// Усі наступні запити матимуть заголовок:
// Authorization: Bearer your-token-here
```

### Очищення кешу

```javascript
import { clearCache, getCacheSize } from './api.js';

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
