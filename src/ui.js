// Модуль для управління DOM та рендерингу

import { getTasks, createTask, updateTask, deleteTask } from './api.js';

let currentPage = 1;
const LIMIT = 10;

/**
 * Згенерувати HTML для списку завдань
 * @param {Array} tasks - масив завдань
 * @returns {string} - HTML розмітка
 */
export function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    return '<p class="empty-message">Немає завдань для відображення</p>';
  }

  return tasks.map(task => `
    <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <div class="task-content">
        <input
          type="checkbox"
          class="task-checkbox"
          ${task.completed ? 'checked' : ''}
          data-id="${task.id}"
        />
        <div class="task-text">
          <span class="task-title">${escapeHtml(task.title)}</span>
          <span class="task-id">ID: ${task.id}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-edit" data-id="${task.id}">✏️ Редагувати</button>
        <button class="btn-delete" data-id="${task.id}">🗑️ Видалити</button>
      </div>
    </div>
  `).join('');
}

/**
 * Екранування HTML для безпеки
 * @param {string} str - рядок
 * @returns {string} - екранований рядок
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Показати сповіщення
 * @param {string} message - текст повідомлення
 * @param {string} type - тип ('success', 'error', 'info')
 */
export function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.classList.add('show'), 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/**
 * Показати індикатор завантаження
 */
export function showLoading() {
  const container = document.querySelector('#tasks-container');
  if (container) {
    container.innerHTML = '<div class="loading">⏳ Завантаження...</div>';
  }
}

/**
 * Оновити відображення завдань
 * @param {number} page - номер сторінки
 */
export async function updateTasksDisplay(page = currentPage) {
  showLoading();

  try {
    const tasks = await getTasks(page, LIMIT);
    const container = document.querySelector('#tasks-container');

    if (container) {
      container.innerHTML = renderTasks(tasks);
      attachTaskEventListeners();
    }

    updatePaginationInfo(page);
  } catch (error) {
    showNotification(`Помилка завантаження: ${error.message}`, 'error');
    const container = document.querySelector('#tasks-container');
    if (container) {
      container.innerHTML = '<p class="error-message">Не вдалося завантажити завдання</p>';
    }
  }
}

/**
 * Прикріпити обробники подій до завдань
 */
function attachTaskEventListeners() {
  // Обробники для чекбоксів
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleTaskToggle);
  });

  // Обробники для кнопок редагування
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', handleTaskEdit);
  });

  // Обробники для кнопок видалення
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', handleTaskDelete);
  });
}

/**
 * Обробник перемикання статусу завдання
 * @param {Event} event - подія
 */
async function handleTaskToggle(event) {
  const id = parseInt(event.target.dataset.id);
  const completed = event.target.checked;

  try {
    await updateTask(id, { completed });
    showNotification('Статус оновлено!');

    // Оновлюємо візуальне відображення
    const taskItem = event.target.closest('.task-item');
    taskItem.classList.toggle('completed', completed);
  } catch (error) {
    showNotification(`Помилка оновлення: ${error.message}`, 'error');
    event.target.checked = !completed; // Повертаємо попередній стан
  }
}

/**
 * Обробник редагування завдання
 * @param {Event} event - подія
 */
async function handleTaskEdit(event) {
  const id = parseInt(event.target.dataset.id);
  const taskItem = event.target.closest('.task-item');
  const titleSpan = taskItem.querySelector('.task-title');
  const currentTitle = titleSpan.textContent;

  const newTitle = prompt('Введіть нову назву завдання:', currentTitle);

  if (newTitle && newTitle.trim() !== '' && newTitle !== currentTitle) {
    try {
      await updateTask(id, { title: newTitle.trim() });
      titleSpan.textContent = newTitle.trim();
      showNotification('Завдання оновлено!');
    } catch (error) {
      showNotification(`Помилка оновлення: ${error.message}`, 'error');
    }
  }
}

/**
 * Обробник видалення завдання
 * @param {Event} event - подія
 */
async function handleTaskDelete(event) {
  const id = parseInt(event.target.dataset.id);

  if (confirm('Ви впевнені, що хочете видалити це завдання?')) {
    try {
      await deleteTask(id);
      const taskItem = event.target.closest('.task-item');
      taskItem.style.opacity = '0';
      setTimeout(() => taskItem.remove(), 300);
      showNotification('Завдання видалено!');
    } catch (error) {
      showNotification(`Помилка видалення: ${error.message}`, 'error');
    }
  }
}

/**
 * Обробник створення нового завдання
 * @param {Event} event - подія submit форми
 */
export async function handleCreateTask(event) {
  event.preventDefault();

  const input = document.querySelector('#new-task-input');
  const title = input.value.trim();

  if (!title) {
    showNotification('Введіть назву завдання', 'error');
    return;
  }

  try {
    const newTask = await createTask({
      title,
      completed: false,
      userId: 1,
    });

    showNotification('Завдання створено!');
    input.value = '';

    // Додаємо нове завдання на сторінку
    const container = document.querySelector('#tasks-container');
    const taskHtml = renderTasks([newTask]);
    container.insertAdjacentHTML('afterbegin', taskHtml);
    attachTaskEventListeners();
  } catch (error) {
    showNotification(`Помилка створення: ${error.message}`, 'error');
  }
}

/**
 * Обробник пагінації
 * @param {string} direction - 'next' або 'prev'
 */
export function handlePagination(direction) {
  if (direction === 'next') {
    currentPage++;
  } else if (direction === 'prev' && currentPage > 1) {
    currentPage--;
  }

  updateTasksDisplay(currentPage);
  savePageToLocalStorage();
}

/**
 * Оновити інформацію про пагінацію
 * @param {number} page - поточна сторінка
 */
function updatePaginationInfo(page) {
  const info = document.querySelector('#page-info');
  if (info) {
    info.textContent = `Сторінка ${page}`;
  }

  // Вимкнути кнопку "Назад" на першій сторінці
  const prevBtn = document.querySelector('#btn-prev');
  if (prevBtn) {
    prevBtn.disabled = page === 1;
  }
}

/**
 * Зберегти номер сторінки у localStorage
 */
function savePageToLocalStorage() {
  localStorage.setItem('currentPage', currentPage);
}

/**
 * Відновити номер сторінки з localStorage
 */
export function restorePageFromLocalStorage() {
  const savedPage = localStorage.getItem('currentPage');
  if (savedPage) {
    currentPage = parseInt(savedPage);
  }
  return currentPage;
}

/**
 * Отримати поточну сторінку
 * @returns {number} - номер поточної сторінки
 */
export function getCurrentPage() {
  return currentPage;
}
