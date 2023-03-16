const BACKEND_URL = "https://intership-liga.ru";

const taskList = document.querySelector(".tasks-container");
const addButton = document.querySelector("#addTaskButton");
const getTasksButton = document.querySelector("#getTasksButton");

let currentPage = 1;
let totalTasks = 0;
const tasksPerPage = 10;

const task = {
  name: "",
  info: "",
  isImportant: false,
};

const updatedTask = {
  name: "",
  info: "",
  isImportant: false,
};

const getTasks = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks`);
    if (!response.ok) {
      throw new Error(`Ошибка:( Статус: ${response.status}`);
    }
    const allTasks = await response.json();
    totalTasks = allTasks.length;
    displayTasks(allTasks);

    console.log(allTasks);
  } catch (error) {
    console.error(error);
  }
};

const getOneTask = async (taskId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error(`Ошибка:( Статус: ${response.status}`);
    }
    const task = await response.json();
    console.log(task);
    return task;
  } catch (error) {
    console.error(error);
  }
};

const deleteOneTask = async (taskId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Ошибка:( Статус: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    getTasks();
  } catch (error) {
    console.error(error);
  }
};

const addTask = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const newTask = await response.json();
    console.log(newTask);
    getTasks();
  } catch (error) {
    console.error(error);
  }
};

const patchTask = async (taskId, updatedTask) => {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
    if (!response.ok) {
      throw new Error(`Ошибка:( Статус: ${response.status}`);
    }
    const patchedTask = await response.json();
    console.log(patchedTask);
    getTasks();
  } catch (error) {
    console.error(error);
  }
};

const displayTasks = (tasks) => {
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = tasks.slice(startIndex, endIndex);

  taskList.innerHTML = "";

  for (const task of paginatedTasks) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.innerHTML = `<h3 ><a href="#!" class="one-task" data-id=${
      task.id
    } >${task.name}</a></h3> <p>${
      task.info
    }</p> <button class="delete-button" data-id="${
      task.id
    }">Удалить</button> <button class="edit-button" data-id="${
      task.id
    }">Редактировать</button> <label> <input type="checkbox" ${
      task.isImportant ? "checked" : ""
    } /> Важное </label>`;
    taskList.appendChild(taskElement);
  }

  const totalPageCount = Math.ceil(totalTasks / tasksPerPage);
  const paginationElement = document.createElement("div");
  paginationElement.classList.add("pagination");
  for (let i = 1; i <= totalPageCount; i++) {
    const pageButton = document.createElement("button");
    pageButton.classList.add("page");
    pageButton.textContent = i;
    if (i === currentPage) {
      pageButton.classList.add("active");
    }
    paginationElement.appendChild(pageButton);
  }
  taskList.appendChild(paginationElement);
};

const selectTask = (taskElement) => {
  const selectedTaskElement = taskList.querySelector(".selected");
  if (selectedTaskElement) {
    selectedTaskElement.classList.remove("selected");
  }
  taskElement.classList.add("selected");
};

taskList.addEventListener("click", (event) => {
  const taskElement = event.target.closest(".task");
  if (taskElement) {
    selectTask(taskElement);
  }
  if (event.target.classList.contains("delete-button")) {
    const taskId = event.target.dataset.id;
    deleteOneTask(taskId);
  }
  if (event.target.classList.contains("one-task")) {
    const taskId = event.target.dataset.id;
    getOneTask(taskId);
  }
  if (event.target.classList.contains("edit-button")) {
    const taskId = event.target.dataset.id;
    updatedTask.name = prompt("Введите новое название задачи:");
    updatedTask.info = prompt("Введите новое описание задачи:");
    updatedTask.isImportant = confirm("Важная задача?");
    patchTask(taskId, updatedTask);
  }
});

getTasksButton.addEventListener("click", () => {
  getTasks();
});

addButton.addEventListener("click", () => {
  task.name = prompt("Введите название задачи:");
  task.info = prompt("Введите описание задачи:");
  task.isImportant = confirm("Важная задача?");
  addTask();
});

taskList.addEventListener("click", (event) => {
  if (event.target.classList.contains("page")) {
    currentPage = +event.target.textContent;
    getTasks();
  }
});
