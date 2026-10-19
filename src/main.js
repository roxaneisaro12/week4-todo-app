
import './style.css';

// Find the HTML elements used by the app.
const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskPriority = document.querySelector('#task-priority');
const taskList = document.querySelector('#task-list');
const taskCounter = document.querySelector('#task-counter');
const formError = document.querySelector('#form-error');
const emptyState = document.querySelector('#empty-state');
const taskSearch = document.querySelector('#task-search');
const filterButtons = document.querySelectorAll('.filter-button');
const clearCompletedButton = document.querySelector('#clear-completed');

// Restore saved chores and filter from localStorage.
let tasks = JSON.parse(localStorage.getItem('family-chores-tasks') || '[]');
let currentFilter = localStorage.getItem('family-chores-filter') || 'all';
let searchText = '';
let editingId = null;

// Saves the current chores and filter in the browser.
function saveState() {
  localStorage.setItem('family-chores-tasks', JSON.stringify(tasks));
  localStorage.setItem('family-chores-filter', currentFilter);
}

// Shows an error message below the chore input.
function showError(message) {
  formError.textContent = message;
  formError.classList.remove('hidden');
}

// Clears the form error message.
function clearError() {
  formError.textContent = '';
  formError.classList.add('hidden');
}

// Returns chores matching the current filter and search.
function getVisibleTasks() {
  return tasks.filter((task) => {
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'active' && !task.done) ||
      (currentFilter === 'completed' && task.done);

    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesFilter && matchesSearch;
  });
}

// Builds and displays the chore list and updates the counter.
function render() {
  taskList.replaceChildren();

  const visibleTasks = getVisibleTasks();
  const remaining = tasks.filter((task) => !task.done).length;

  taskCounter.textContent =
    `${remaining} task${remaining === 1 ? '' : 's'} left`;

  visibleTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className =
      'flex flex-col gap-3 rounded-xl border border-[#e3e8df] p-4 sm:flex-row sm:items-center sm:justify-between';

    const label = document.createElement('label');
    label.className = 'flex min-w-0 items-center gap-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = task.id;
    checkbox.setAttribute('aria-label', `Complete ${task.text}`);
    checkbox.className = 'size-5 shrink-0 accent-[#42634c]';

    label.append(checkbox);

    if (editingId === task.id) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.text;
      editInput.maxLength = 100;
      editInput.dataset.action = 'edit-input';
      editInput.dataset.id = task.id;
      editInput.setAttribute('aria-label', 'Edit chore name');
      editInput.className =
        'min-w-0 flex-1 rounded-lg border border-[#d8e0d5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#66856b]';

      label.append(editInput);
      setTimeout(() => {
        editInput.focus();
        editInput.select();
      }, 0);
    } else {
      const taskText = document.createElement('span');
      taskText.textContent = task.text;
      taskText.className = task.done
        ? 'break-words text-sm text-gray-400 line-through'
        : 'break-words text-sm font-medium text-[#26352d]';

      label.append(taskText);
    }

    const priority = document.createElement('span');
    priority.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const priorityStyles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-amber-100 text-amber-800',
      low: 'bg-green-100 text-green-800',
    };

    priority.className =
      `self-start rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority] || priorityStyles.medium}`;

    const actions = document.createElement('div');
    actions.className = 'flex gap-2';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = editingId === task.id ? 'Save' : 'Edit';
    editButton.dataset.action = editingId === task.id ? 'save' : 'edit';
    editButton.dataset.id = task.id;
    editButton.className =
      'rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = task.id;
    deleteButton.className =
      'rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300';

    actions.append(editButton, deleteButton);
    item.append(label, priority, actions);
    taskList.append(item);
  });

  emptyState.textContent = tasks.length === 0
    ? 'Your home is a blank canvas. Add your first chore to get started.'
    : visibleTasks.length === 0
      ? 'No chores match this filter or search. Try another one!'
      : '';

  emptyState.classList.toggle('hidden', visibleTasks.length > 0);

  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === currentFilter;

    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('bg-[#42634c]', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('bg-[#f0f3ed]', !selected);
    button.classList.toggle('text-[#42634c]', !selected);
  });
}

// Validates and adds a new chore to the state.
function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    showError('Please enter a chore before adding it.');
    taskInput.focus();
    return;
  }

  if (text.length > 100) {
    showError('A chore cannot exceed 100 characters.');
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text,
    done: false,
    priority: taskPriority.value,
    createdAt: Date.now(),
  });

  taskForm.reset();
  clearError();
  saveState();
  render();
  taskInput.focus();
}

// Changes whether a chore is completed.
function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  task.done = !task.done;
  saveState();
  render();
}

// Starts inline editing for a chore.
function editTask(id) {
  editingId = id;
  clearError();
  render();
}

// Saves the edited chore after validation.
function saveEdit(id) {
  const input = taskList.querySelector(
    `input[data-action="edit-input"][data-id="${id}"]`
  );

  const text = input.value.trim();

  if (!text) {
    showError('A chore name cannot be empty.');
    input.focus();
    return;
  }

  if (text.length > 100) {
    showError('A chore cannot exceed 100 characters.');
    input.focus();
    return;
  }

  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  task.text = text;
  editingId = null;
  clearError();
  saveState();
  render();
}

// Cancels editing without changing the saved chore.
function cancelEdit() {
  editingId = null;
  clearError();
  render();
}

// Deletes a chore after the user confirms.
function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this chore?')) return;

  tasks = tasks.filter((task) => task.id !== id);

  if (editingId === id) editingId = null;

  saveState();
  render();
}

// Removes all completed chores after confirmation.
function clearCompleted() {
  const completedCount = tasks.filter((task) => task.done).length;

  if (completedCount === 0) {
    showError('There are no completed chores to clear.');
    return;
  }

  if (!confirm(`Clear ${completedCount} completed chore(s)?`)) return;

  tasks = tasks.filter((task) => !task.done);
  saveState();
  render();
}

// Adds a chore when the form is submitted.
taskForm.addEventListener('submit', addTask);

// Handles checkbox changes in the chore list.
taskList.addEventListener('change', (event) => {
  if (event.target.dataset.action === 'toggle') {
    toggleTask(event.target.dataset.id);
  }
});

// Handles Edit, Save, and Delete button clicks.
taskList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'edit') editTask(id);
  if (action === 'save') saveEdit(id);
  if (action === 'delete') deleteTask(id);
});

// Saves inline edits with Enter and cancels with Escape.
taskList.addEventListener('keydown', (event) => {
  if (event.target.dataset.action !== 'edit-input') return;

  if (event.key === 'Enter') {
    event.preventDefault();
    saveEdit(event.target.dataset.id);
  }

  if (event.key === 'Escape') {
    cancelEdit();
  }
});

// Updates the selected filter.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    saveState();
    render();
  });
});

// Searches chores as the user types.
taskSearch.addEventListener('input', () => {
  searchText = taskSearch.value.trim();
  render();
});

// Connects the Clear Completed button.
clearCompletedButton.addEventListener('click', clearCompleted);

// Displays saved chores when the page loads.
render();
