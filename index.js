let userInput = document.getElementById("userInput");
let addButton = document.getElementById("addButton");
let todoList = document.getElementById("todoList");
let totalTaskCounterText = document.getElementById("totalTasksCounter");
let completedTaskCounterText = document.getElementById("completedTasksCounter");
let noTaskTag = document.getElementById("noTaskText");
let selectDropDownList = document.getElementById("filterDropDown");

let totalTasksCount;
let completedTasksCount;
let tasks = [];

try {
  tasks = loadTasksFromLocalStorage();
} catch {
  console.log("Error parsing task. Empty list!");
  tasks = [];
}
let filterSelected = "all";
selectDropDownList.addEventListener("change", () => {
  switch (selectDropDownList.value) {
    case "all":
      filterSelected = "all";
      break;
    case "completed":
      filterSelected = "completed";
      break;
    case "incomplete":
      filterSelected = "incomplete";
      break;
  }

  renderTasks(filterSelected);
});

//render tasks on refresh
updateCounters();
renderTasks(filterSelected);

addButton.addEventListener("click", addTask);

//add task on enter key
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  if (userInput.value === "") {
    alert("you have entered a blank task. Try again");
    return;
  }
  //add task obj to tasks array
  let task = {
    text: userInput.value,
    completed: false,
  };
  tasks.push(task);
  totalTasksCount++;
  userInput.value = "";
  updateCounters();
  saveTasks();
  //shows all tasks when adding a new task to todo
  filterSelected = "all";
  selectDropDownList.value = filterSelected;
  renderTasks(filterSelected);
}

function renderTasks(filter) {
  todoList.innerHTML = "";
  let tasksToDisplay = [];
  switch (filter) {
    case "all":
      tasksToDisplay = tasks;
      break;
    case "completed":
      tasksToDisplay = tasks.filter((task) => task.completed);
      break;
    case "incomplete":
      tasksToDisplay = tasks.filter((task) => !task.completed);
      break;
  }

  //render tasks to the DOM
  tasksToDisplay.forEach((task, index) => {
    let li = document.createElement("li");

    //create text span element
    let taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) {
      taskText.style.textDecoration = "line-through";
    }

    //checkbox
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;

    checkBox.addEventListener("change", () => {
      task.completed = checkBox.checked;
      taskText.style.textDecoration = checkBox.checked
        ? "line-through"
        : "none";

      completedTasksCount = checkBox.checked
        ? ++completedTasksCount
        : --completedTasksCount;

      updateCounters();
      saveTasks();
      renderTasks(filterSelected);
    });

    //delete button
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      li.remove();
      tasks.splice(index, 1);
      completedTasksCount = checkBox.checked
        ? --completedTasksCount
        : completedTasksCount;
      updateCounters();
      saveTasks();
      renderTasks(filterSelected);
    });

    //edit button
    let editButton = document.createElement("button");
    editButton.textContent = "Edit";
    let inputBox = document.createElement("input");
    inputBox.type = "text";

    if (task.completed) editButton.disabled = true;

    editButton.addEventListener("click", () => {
      //replace the li text with a input box
      inputBox.value = task.text;
      li.replaceChild(inputBox, taskText);
      //lets user directly type by bringing the cursor to the element
      inputBox.focus();
    });

    inputBox.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        task.text = inputBox.value;
        taskText.textContent = task.text;
        li.replaceChild(taskText, inputBox);
        updateCounters();
        saveTasks();
        renderTasks(filterSelected);
      }
    });

    //append to list
    li.appendChild(checkBox);
    li.appendChild(taskText);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    todoList.append(li);
  });
}

function updateCounters() {
  //update total and completed tasks counters
  totalTasksCount = tasks.length;
  totalTaskCounterText.innerText = totalTasksCount;
  //add a note to h tag if there are no tasks
  if (totalTasksCount === 0) {
    noTaskTag.innerHTML = "No Task Yet";
  } else {
    noTaskTag.innerHTML = "";
  }
  completedTasksCount = tasks.filter((task) => task.completed).length;
  completedTaskCounterText.innerText = completedTasksCount;
}

function saveTasks() {
  //save tasks to local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
  //load tasks from local storage
  const loadedTasks = localStorage.getItem("tasks");
  return loadedTasks ? JSON.parse(loadedTasks) : [];
}
