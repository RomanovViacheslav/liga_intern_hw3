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


const getTasks = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${BACKEND_URL}/tasks`);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const allTasks = JSON.parse(xhr.response);
      totalTasks = allTasks.length;
      displayTasks(allTasks);
      console.log(allTasks);
    } else {
      console.error(`Ошибка:( Статус: ${xhr.status}`);
    }
  };
  xhr.send();
};

const getOneTask = (taskId) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${BACKEND_URL}/tasks/${taskId}`);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const task = JSON.parse(xhr.response);
      console.log(task);
      return task;
    } else {
      console.error(`Ошибка:( Статус: ${xhr.status}`);
    }
  };
  xhr.send();
};

const deleteOneTask = (taskId) => {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${BACKEND_URL}/tasks/${taskId}`);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const result = JSON.parse(xhr.response);
      console.log(result);
      getTasks();
    } else {
      console.error(`Ошибка:( Статус: ${xhr.status}`);
    }
  };
  xhr.send();
};

const addTask = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${BACKEND_URL}/tasks`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    const newTask = JSON.parse(xhr.response);
    console.log(newTask);
    getTasks();
  };
  xhr.send(JSON.stringify(task));
};

const patchTask = (taskId, updatedTask) => {
  const xhr = new XMLHttpRequest();
  xhr.open("PATCH", `${BACKEND_URL}/tasks/${taskId}`);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const patchedTask = JSON.parse(xhr.response);
      console.log(patchedTask);
      getTasks();
    } else {
      console.error(`Ошибка:( Статус: ${xhr.status}`);
    }
  };
  xhr.send(JSON.stringify(updatedTask));
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