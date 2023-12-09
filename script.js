const apiKey = "7af2e8-ee1de7-46483c-46fee1-c47c67";
const apiUrl = "https://cse204.work/todos";

generateTodoList();

function generateTodoList() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = (event) => {
        if (event.target.readyState == 4 && event.target.status == 200) {
            let todos = JSON.parse(event.target.responseText);
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

    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];

        let todoContainer = document.createElement("div");
        todoContainer.classList.add("todo-container");

        if (todo.completed) {
            todoContainer.classList.add("completed");
        }

        todoList.appendChild(todoContainer);

        let checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("checkbox-container");
        todoContainer.appendChild(checkboxContainer);

        let checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = "Mark as complete?";
        checkboxContainer.appendChild(checkboxLabel);

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        checkbox.addEventListener("change", function () {
            updateTodoStatus(todo.id, checkbox.checked);
        });
        checkboxContainer.appendChild(checkbox);

        let textContainer = document.createElement("div");
        textContainer.classList.add("text-container");
        todoContainer.appendChild(textContainer);

        let text = document.createElement("span");
        text.textContent = todo.text;
        textContainer.appendChild(text);

        let editContainer = document.createElement("div");
        editContainer.classList.add("edit-container");
        todoContainer.appendChild(editContainer);

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            switchToEditMode(todo.id, todo.text, todoContainer);
        });
        editContainer.appendChild(editButton);

        let deleteContainer = document.createElement("div");
        deleteContainer.classList.add("delete-container");
        todoContainer.appendChild(deleteContainer);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteTodo(todo.id);
        });
        deleteContainer.appendChild(deleteButton);
    }
}

function updateTodoStatus(todoId, completed) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            generateTodoList();
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }
    request.open("PUT", apiUrl + `/${todoId}`, true);
    request.setRequestHeader("Content-type", "application/json");
    request.setRequestHeader("x-api-key", apiKey);
    request.send(JSON.stringify({ completed }));

}

function deleteTodo(todoId) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            generateTodoList();
        } else if (this.readyState == 4) {
            console.log(this.responseText);
        }
    }

    request.open("DELETE", apiUrl + `/${todoId}`, true);
    request.setRequestHeader("x-api-key", apiKey);
    request.send();
}

function switchToEditMode(todoId, currentText, todoItem) {
    let textContainer = todoItem.querySelector('.text-container');

    let checkbox = todoItem.querySelector('.checkbox-container input[type="checkbox"]');
    let initialCheckedState = checkbox.checked;

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.value = currentText;
    inputField.classList.add("text-input");

    textContainer.innerHTML = "";
    textContainer.appendChild(inputField);

    let editButton = todoItem.querySelector('.edit-container button');
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
