let userInput = document.getElementById("userInput");
let addButton = document.getElementById("addButton");
let todoList = document.getElementById("todoList");
let totalTaskCounterText = document.getElementById("totalTasksCounter");
let completedTaskCounterText = document.getElementById("completedTasksCounter");
let noTaskTag = document.getElementById("noTaskText");

let totalTasksCount;
let completedTasksCount;
let tasks = [];

try {
  tasks = loadTasksFromLocalStorage();
} catch {
  console.log("Error parsing task. Empty list!");
  tasks = [];
}

//render tasks on refresh
updateCounters();
renderTasks();

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
  renderTasks();
}

function renderTasks() {
  todoList.innerHTML = "";
  //render tasks to the DOM
  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    let taskText = document.createTextNode(task.text);

    //checkbox
    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;
    li.style.textDecoration = checkBox.checked ? "line-through" : "none";
    checkBox.addEventListener("change", () => {
      task.completed = checkBox.checked;
      li.style.textDecoration = checkBox.checked ? "line-through" : "none";
      completedTasksCount = checkBox.checked
        ? ++completedTasksCount
        : --completedTasksCount;
      console.log(completedTasksCount);
      updateCounters();
      saveTasks();
      renderTasks();
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
      renderTasks();
    });

    //append to list
    li.appendChild(checkBox);
    li.appendChild(taskText);
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
  console.log(tasks);
}

function loadTasksFromLocalStorage() {
  //load tasks from local storage
  const loadedTasks = localStorage.getItem("tasks");
  return loadedTasks ? JSON.parse(loadedTasks) : [];
}
