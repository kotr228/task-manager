// Точка входу застосунку

import {
  updateTasksDisplay,
  handleCreateTask,
  handlePagination,
  restorePageFromLocalStorage
} from './ui.js';

/**
 * Ініціалізація застосунку
 */
async function init() {
  console.log('Ініціалізація застосунку Task Manager...');

  // Відновлюємо збережену сторінку
  const savedPage = restorePageFromLocalStorage();

  try {
    // Завантажуємо завдання
    await updateTasksDisplay(savedPage);

    // Додаємо обробники подій
    setupEventListeners();

    console.log('Застосунок успішно ініціалізовано');
  } catch (error) {
    console.error('Помилка ініціалізації:', error);
  }
}

/**
 * Налаштування обробників подій
 */
function setupEventListeners() {
  // Форма створення нового завдання
  const form = document.querySelector('#create-task-form');
  if (form) {
    form.addEventListener('submit', handleCreateTask);
  }

  // Кнопки пагінації
  const btnPrev = document.querySelector('#btn-prev');
  if (btnPrev) {
    btnPrev.addEventListener('click', () => handlePagination('prev'));
  }

  const btnNext = document.querySelector('#btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => handlePagination('next'));
  }

  // Збереження стану при закритті вкладки
  window.addEventListener('beforeunload', () => {
    console.log('Збереження стану...');
  });
}

// Запуск після завантаження DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
