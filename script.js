
let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("myTasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch (error) {
    tasks = [];
}

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const search = document.getElementById("search");

function saveTasks() {
    localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function addTask(event) {
    event.preventDefault();

    let value = taskInput.value.trim();

    if (value === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: value,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    displayTasks();
}

function displayTasks() {

    taskList.innerHTML = "";

    let searchText = search.value.toLowerCase();

    let filteredTasks = tasks.filter(function(task) {

        let matchesSearch =
            task.text.toLowerCase().includes(searchText);

        let matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (filteredTasks.length === 0) {
        let message = document.createElement("li");
        message.className = "empty";
        message.textContent = "No tasks found!";
        taskList.appendChild(message);
    }

    filteredTasks.forEach(function(task) {

        let li = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            saveTasks();
            displayTasks();
        });

        let span = document.createElement("span");
        span.textContent = task.text;

        if (task.completed) {
            span.classList.add("completed");
        }

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";

        editButton.addEventListener("click", function() {

            let newTask = prompt("Edit your task:", task.text);

            if (newTask !== null && newTask.trim() !== "") {
                task.text = newTask.trim();
                saveTasks();
                displayTasks();
            }
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        deleteButton.addEventListener("click", function() {

            tasks = tasks.filter(function(t) {
                return t.id !== task.id;
            });

            saveTasks();
            displayTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    document.getElementById("total").textContent = tasks.length;

    document.getElementById("done").textContent =
        tasks.filter(t => t.completed).length;

    document.getElementById("pending").textContent =
        tasks.filter(t => !t.completed).length;
}

document.getElementById("taskForm")
    .addEventListener("submit", addTask);

search.addEventListener("input", displayTasks);

document.querySelectorAll(".filters button")
    .forEach(function(button) {

        button.addEventListener("click", function() {
            currentFilter = button.dataset.filter;
            displayTasks();
        });
    });

document.getElementById("clear")
    .addEventListener("click", function() {

        if (confirm("Delete all completed tasks?")) {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            displayTasks();
        }
    });

displayTasks();
