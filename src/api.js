// Модуль для роботи з HTTP-запитами

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

// Кеш для зберігання даних
const cache = new Map();

// Опціональний токен авторизації
let token = null;

/**
 * Встановити токен авторизації
 * @param {string} newToken - токен для авторизації
 */
export function setAuthToken(newToken) {
  token = newToken;
}

/**
 * Перевірити відповідь на помилки
 * @param {Response} response - відповідь від сервера
 * @returns {Response} - відповідь якщо OK
 * @throws {Error} - помилка з кодом статусу
 */
function checkResponse(response) {
  if (!response.ok) {
    const error = new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.statusText = response.statusText;
    throw error;
  }
  return response;
}

/**
 * Отримати базові заголовки для запитів
 * @returns {Object} - об'єкт з заголовками
 */
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Отримати завдання з пагінацією
 * @param {number} page - номер сторінки
 * @param {number} limit - кількість елементів на сторінці
 * @returns {Promise<Array>} - масив завдань
 */
export async function getTasks(page = 1, limit = 10) {
  const cacheKey = `tasks_${page}_${limit}`;

  // Перевіряємо кеш
  if (cache.has(cacheKey)) {
    console.log('Returning from cache:', cacheKey);
    return cache.get(cacheKey);
  }

  const url = `${API_URL}?_page=${page}&_limit=${limit}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    checkResponse(response);
    const tasks = await response.json();

    // Зберігаємо в кеш
    cache.set(cacheKey, tasks);

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

/**
 * Створити нове завдання
 * @param {Object} task - об'єкт завдання
 * @returns {Promise<Object>} - створене завдання
 */
export async function createTask(task) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(task),
    });

    checkResponse(response);
    const newTask = await response.json();

    // Очищаємо кеш після створення
    cache.clear();

    return newTask;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

/**
 * Оновити завдання (часткове оновлення)
 * @param {number} id - ID завдання
 * @param {Object} updates - зміни для завдання
 * @returns {Promise<Object>} - оновлене завдання
 */
export async function updateTask(id, updates) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    checkResponse(response);
    const updatedTask = await response.json();

    // Очищаємо кеш після оновлення
    cache.clear();

    return updatedTask;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
}

/**
 * Видалити завдання
 * @param {number} id - ID завдання
 * @returns {Promise<boolean>} - успішність операції
 */
export async function deleteTask(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    checkResponse(response);

    // Очищаємо кеш після видалення
    cache.clear();

    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
}

/**
 * Групове оновлення завдань
 * @param {Array<number>} ids - масив ID завдань
 * @param {Object} updates - зміни для застосування
 * @returns {Promise<Array>} - масив оновлених завдань
 */
export async function bulkUpdate(ids, updates) {
  try {
    const promises = ids.map(id => updateTask(id, updates));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error in bulk update:', error);
    throw new Error(`Bulk update failed: ${error.message}`);
  }
}

/**
 * Очистити кеш
 */
export function clearCache() {
  cache.clear();
  console.log('Cache cleared');
}

/**
 * Отримати розмір кешу
 * @returns {number} - кількість елементів у кеші
 */
export function getCacheSize() {
  return cache.size;
}
