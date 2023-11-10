const apiKey = "7af2e8-ee1de7-46483c-46fee1-c47c67";
const apiUrl = "https://cse204.work/todos";

generateTodoList();

function generateTodoList() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.status == 200) {
            let todos = JSON.parse(event.target.responseText);
            console.log(todos);
            generateTodoListMarkup(todos);
        } else if (event.target.readyState == 4) {
            console.log(event.target.responseText);
        }
    }
    request.open("GET", apiUrl, true);
    request.setRequestHeader("x-api-key", apiKey);
    request.send();
}

function generateTodoListMarkup(todos) {
    let todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    let todoListUl = document.createElement("ul");
    todoList.appendChild(todoListUl);

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        let todoItem = document.createElement("li");
        todoItem.setAttribute("id", todo.id);
        todoItem.setAttribute("class", "todo");

        // Checkbox for checking off todo
        let checkboxLabel = document.createElement("label");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("click", function () {
            updateTodoStatus(todo.id, checkbox.checked);
        });

        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode(todo.text));
        todoItem.appendChild(checkboxLabel);

        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.addEventListener("click", function () {
            switchToEditMode(todo.id, todo.text, todoItem);
        });
        todoItem.appendChild(editButton);

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteTodo(todo.id);
        });
        todoItem.appendChild(deleteButton);

        todoListUl.appendChild(todoItem);
    }
}

function updateTodoStatus(todoId, completed) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            generateTodoList(); // Update the UI after modifying the todo
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    console.log("update?")
    console.log(todoId)
    console.log(completed)
    request.open("PUT", apiUrl + `/${todoId}`, true);
    request.setRequestHeader("Content-type", "application/json");
    request.setRequestHeader("x-api-key", apiKey);
    request.send(JSON.stringify({ completed }));
}

function deleteTodo(todoId) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            generateTodoList(); // Update the UI after deleting the todo
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    request.open("DELETE", apiUrl + `/${todoId}`, true);
    request.setRequestHeader("x-api-key", apiKey);
    request.send();
}

function switchToEditMode(todoId, currentText, todoItem) {
    let label = todoItem.querySelector('label');
    let checkbox = label.querySelector('input[type="checkbox"]');
    let initialCheckedState = checkbox.checked;

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;

    label.innerHTML = "";
    label.appendChild(checkbox);
    label.appendChild(inputField);

    let editButton = todoItem.querySelector('button');
    editButton.innerText = "Save";
    editButton.removeEventListener("click", switchToEditMode);

    editButton.addEventListener("click", function () {
        saveChanges(todoId, inputField.value, todoItem, initialCheckedState);
    });
}

function saveChanges(todoId, newText, todoItem, initialCheckedState) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            generateTodoList();
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }

    let url = apiUrl + `/${todoId}`;
    let data = {
        text: newText,
        completed: initialCheckedState
    };

    request.open("PUT", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.setRequestHeader("x-api-key", apiKey);
    request.send(JSON.stringify(data));
}

const newTodoForm = document.getElementById("new-todo-form");
newTodoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let newTodoText = document.getElementById("new-todo-text").value;
    let newTodo = {
        text: newTodoText
    };

    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let todo = JSON.parse(this.responseText);
            console.log(todo);
            generateTodoList();
            document.getElementById("new-todo-text").value = "";
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    request.open("POST", apiUrl, true);
    request.setRequestHeader("Content-type", "application/json");
    request.setRequestHeader("x-api-key", apiKey);
    request.send(JSON.stringify(newTodo));
});