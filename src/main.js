
import './style.css';

// Select the page elements used by the app.
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
const totalStat = document.querySelector('#total-stat');
const activeStat = document.querySelector('#active-stat');
const completedStat = document.querySelector('#completed-stat');

// Restore saved chores and the selected filter from localStorage.
let tasks = JSON.parse(localStorage.getItem('family-chores-tasks') || '[]');
let currentFilter = localStorage.getItem('family-chores-filter') || 'all';
let searchText = '';
let editingId = null;

// Save chores and the current filter in the browser.
function saveState() {
  localStorage.setItem('family-chores-tasks', JSON.stringify(tasks));
  localStorage.setItem('family-chores-filter', currentFilter);
}

// Display a validation message below the chore input.
function showError(message) {
  formError.textContent = message;
  formError.classList.remove('hidden');
}

// Clear the form validation message.
function clearError() {
  formError.textContent = '';
  formError.classList.add('hidden');
}

// Return chores matching the selected filter and search.
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

// Create the task cards and update the statistics.
function render() {
  taskList.replaceChildren();

  const visibleTasks = getVisibleTasks();
  const remaining = tasks.filter((task) => !task.done).length;
  const completed = tasks.length - remaining;

  taskCounter.textContent =
    `${remaining} task${remaining === 1 ? '' : 's'} left`;

  totalStat.textContent = tasks.length;
  activeStat.textContent = remaining;
  completedStat.textContent = completed;

  visibleTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className =
      'flex flex-col gap-4 rounded-2xl border border-[#EAD8DF] bg-[#FFFCFD] p-4 shadow-sm transition hover:border-[#DAB4C3] hover:shadow-md sm:flex-row sm:items-center sm:justify-between';

    const label = document.createElement('label');
    label.className = 'flex min-w-0 flex-1 items-center gap-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.dataset.id = task.id;
    checkbox.setAttribute('aria-label', `Complete ${task.text}`);
    checkbox.className =
      'size-5 shrink-0 cursor-pointer accent-[#762D45]';

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
        'min-w-0 flex-1 rounded-lg border border-[#DAB4C3] bg-white px-3 py-2 text-sm text-[#4A2634] outline-none focus:ring-2 focus:ring-[#C77B98]/30';

      label.append(editInput);
      setTimeout(() => {
        editInput.focus();
        editInput.select();
      }, 0);
    } else {
      const taskText = document.createElement('span');
      taskText.textContent = task.text;
      taskText.className = task.done
        ? 'break-words text-sm text-[#A58D98] line-through'
        : 'break-words text-sm font-semibold text-[#4A2634]';

      label.append(taskText);
    }

    const priority = document.createElement('span');
    priority.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

    const priorityStyles = {
      high: 'bg-[#762D45] text-white',
      medium: 'bg-[#F9E2E7] text-[#762D45]',
      low: 'bg-[#F7F3F5] text-[#795E69] border border-[#EAD8DF]',
    };

    priority.className =
      `self-start rounded-full px-3 py-1.5 text-xs font-bold ${priorityStyles[task.priority] || priorityStyles.medium}`;

    const actions = document.createElement('div');
    actions.className = 'flex shrink-0 gap-2';

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.textContent = editingId === task.id ? 'Save' : 'Edit';
    editButton.dataset.action = editingId === task.id ? 'save' : 'edit';
    editButton.dataset.id = task.id;
    editButton.className =
      'rounded-lg border border-[#E2C7D1] bg-white px-3 py-2 text-sm font-semibold text-[#762D45] transition hover:bg-[#F9E2E7] focus:outline-none focus:ring-2 focus:ring-[#C77B98]';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.dataset.action = 'delete';
    deleteButton.dataset.id = task.id;
    deleteButton.className =
      'rounded-lg px-3 py-2 text-sm font-semibold text-[#9B526D] transition hover:bg-[#F9E2E7] focus:outline-none focus:ring-2 focus:ring-[#C77B98]';

    actions.append(editButton, deleteButton);
    item.append(label, priority, actions);
    taskList.append(item);
  });

  if (tasks.length === 0) {
    emptyState.innerHTML = `
      <span class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F9E2E7] text-2xl text-[#762D45]" aria-hidden="true">♡</span>
      <p class="mt-4 font-semibold text-[#762D45]">A fresh start</p>
      <p class="mt-2 text-sm leading-6 text-[#795E69]">Your chore list is empty. Add your first task and make today a little easier.</p>
    `;
  } else if (visibleTasks.length === 0) {
    emptyState.innerHTML = `
      <span class="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F9E2E7] text-2xl text-[#762D45]" aria-hidden="true">⌕</span>
      <p class="mt-4 font-semibold text-[#762D45]">No chores found</p>
      <p class="mt-2 text-sm leading-6 text-[#795E69]">Try another search or choose a different filter.</p>
    `;
  }

  emptyState.classList.toggle('hidden', visibleTasks.length > 0);

  filterButtons.forEach((button) => {
    const selected = button.dataset.filter === currentFilter;

    button.setAttribute('aria-pressed', String(selected));
    button.classList.toggle('bg-[#762D45]', selected);
    button.classList.toggle('text-white', selected);
    button.classList.toggle('bg-[#F7F3F5]', !selected);
    button.classList.toggle('text-[#762D45]', !selected);
  });
}

// Validate and add a new chore to the task array.
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
    taskInput.focus();
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

// Toggle whether a chore is completed.
function toggleTask(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  task.done = !task.done;
  saveState();
  render();
}

// Start editing a chore inline.
function editTask(id) {
  editingId = id;
  clearError();
  render();
}

// Validate and save the edited chore.
function saveEdit(id) {
  const input = taskList.querySelector(
    `input[data-action="edit-input"][data-id="${id}"]`
  );

  if (!input) return;

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

// Cancel editing without changing the original chore.
function cancelEdit() {
  editingId = null;
  clearError();
  render();
}

// Delete a chore after the user confirms.
function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this chore?')) return;

  tasks = tasks.filter((task) => task.id !== id);

  if (editingId === id) editingId = null;

  saveState();
  render();
}

// Remove completed chores after confirmation.
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
  clearError();
}

// Add chores when the form is submitted.
taskForm.addEventListener('submit', addTask);

// Handle chore completion using event delegation.
taskList.addEventListener('change', (event) => {
  if (event.target.dataset.action === 'toggle') {
    toggleTask(event.target.dataset.id);
  }
});

// Handle Edit, Save, and Delete button clicks.
taskList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;

  if (action === 'edit') editTask(id);
  if (action === 'save') saveEdit(id);
  if (action === 'delete') deleteTask(id);
});

// Save edits with Enter and cancel with Escape.
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

// Change the active task filter.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    saveState();
    render();
  });
});

// Search chores as the user types.
taskSearch.addEventListener('input', () => {
  searchText = taskSearch.value.trim();
  render();
});

// Connect the Clear Completed button.
clearCompletedButton.addEventListener('click', clearCompleted);

// Display saved chores when the page loads.
render();
