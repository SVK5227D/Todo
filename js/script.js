// Select form
var form = document.getElementById("form");
// Getting input field
var input = document.getElementById("input");
// Getting elements to display lists in HTML
var forward = document.getElementById("list");
var forward2 = document.getElementById("completedList");

// Getting data from localStorage
let List = JSON.parse(localStorage.getItem("List")) || [];
let listLength = List.length;
let CompletedList = JSON.parse(localStorage.getItem("CompletedList")) || [];
let completedListLength = CompletedList.length;

// Variable to store the index of an item being edited
let EditList = -1;
let msgText;
//Calling function to getvalue in localstorage
addingTodo();
listCompleted();
form.addEventListener("submit", function (event) {
    event.preventDefault();
    add();
    addingTodo();
    listCompleted();
    localStorage.setItem("List", JSON.stringify(List));
    localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
});
// Function to add a value
function add() {
    let inputValue = input.value.trim();

    // Checking duplicate value
    var isDuplicate = List.some(
        (store) => store.value.toUpperCase() == inputValue.toUpperCase()
    );

    // Checking if the input is empty
    if (inputValue.length == 0) {
        msgText = "You entered an empty text!";
        popupNotification(0, msgText);
    }
    // Checking for duplicate value before storing it in the list
    else if (isDuplicate) {
        if (EditList >= 0) {
            input.value = "";
            document.getElementById("btn").innerHTML = "Add";
            msgText = "There are no changes in your todo";
            popupNotification(1, msgText);
        } else {
            msgText = "This value is already entered in the list";
            popupNotification(0, msgText);
        }
    }
    // Adding or editing the value
    else {
        if (EditList >= 0) {
            List = List.map((q, index) => ({
                ...q,
                value: index == EditList ? inputValue : q.value,
            }));
            EditList = -1;
            document.getElementById("btn").innerHTML = "Add";
            input.value = "";
            msgText = "Changes have been saved in the list";
            popupNotification(1, msgText);
        } else {
            List.push({
                value: inputValue,
                checked: false,
            });
            input.value = "";
            listLength += 1;
            msgText = "Your new todo has been added";
            popupNotification(1, msgText);
        }
    }
}

// Function to display the list of todos
function addingTodo(id) {
    if (List.length == 0) {
        forward.innerHTML =
            '<center class="valueMessage">Your Todo List is empty</center>';
        document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;
        return;
    }

    forward.innerHTML = "";

    List.forEach((todo, index) => {
        if (todo.checked == true) {
            CompletedList.push(todo);
            List = List.filter((h, index) => id != index);
            localStorage.setItem("List", JSON.stringify(List));
            localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
            listLength -= 1;
            completedListLength += 1;
            document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;

            if (List.length == 0) {
                forward.innerHTML =
                    '<center class="valueMessage">Your Todo List is empty</center>';
                document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;
                return;
            }
        }

        forward.innerHTML += `
      <div class="listview" id=${index}>
        <i 
          class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"} check"
          data-action="check"
        ></i> 
        <p class="value" data-action="check">${todo.value}</p>
        <button id="editbutton" class="btnedit bi bi-pencil-square" data-action="edit"></button>
        <button id="deletebutton" class="btndelete bi bi-trash" data-action="delete"></button>   
      </div>`;
    });

    if (listLength > 0) {
        document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;
    }
}

// Function to display the completed list
function listCompleted(id) {
    if (CompletedList.length == 0) {
        forward2.innerHTML =
            '<center class="valueMessage">There are no completed tasks</center>';
        document.getElementById("completedListLength").innerHTML =
            "Completed - " + completedListLength;
        return;
    }

    forward2.innerHTML = "";

    CompletedList.forEach((todo, index) => {
        if (todo.checked == false) {
            List.push(todo);
            CompletedList = CompletedList.filter((h, index) => id != index);
            localStorage.setItem("List", JSON.stringify(List));
            localStorage.setItem("CompletedList", JSON.stringify(CompletedList));
            listLength += 1;
            completedListLength -= 1;
            document.getElementById("taskValue").innerHTML = "Tasks - " + listLength;

            if (CompletedList.length == 0) {
                forward2.innerHTML =
                    '<center class="valueMessage">There are no completed tasks</center>';
                document.getElementById("completedListLength").innerHTML =
                    "Completed - " + completedListLength;
                return;
            }
        }
        forward2.innerHTML += `
      <div class="listview" id=${index}>
        <i 
          class="bi ${todo.checked ? "bi-check-circle-fill" : "bi-circle"} check"
          data-action="checkCompleted"
        ></i> 
        <p class="${todo.checked ? "checked" : ""} value" data-action="check">${todo.value}</p>
      </div>`;
    });

    if (completedListLength > 0) {
        document.getElementById("completedListLength").innerHTML =
            "Completed - " + completedListLength;
    }

    addingTodo();
}

// Event listener for form submission


// Event listener for check, edit, and delete buttons in the list
forward.addEventListener("click", (event) => {
    var target = event.target;
    var click = target.parentNode;
    if (click.className != "listview") return;
    var wl = click.id;
    var action = target.dataset.action;
    action == "check" && checkList(wl);
    action == "edit" && editList(wl);
    action == "delete" && deleteList(wl);
});

forward2.addEventListener("click", (event) => {
    var target = event.target;
    var click = target.parentNode;
    if (click.className != "listview") return;
    // Getting id to Edit or Delete the value in list
    var wl = click.id;
    // Getting action form the list button 
    var action = target.dataset.action;
     //Calling function to Edit nor delete
    action == "checkCompleted" && completedMove(wl);
});

// Function to mark a todo as completed
function completedMove(wl) {
    CompletedList = CompletedList.map((todo, index) => ({
        ...todo,
        checked: index == wl ? !todo.checked : todo.checked,
    }));
    addingTodo();
    listCompleted(wl);
    listCompleted();
    msgText = "Your todo has been moved to task inprocess";
    popupNotification(1, msgText);
}
function checkList(wl) {
    List = List.map((todo, index) => ({
        ...todo,
        checked: index == wl ? !todo.checked : todo.checked,
    }));
    addingTodo(wl);
    listCompleted();
    msgText = "Your todo has been completed";
    popupNotification(1, msgText);
}

// Function to edit a todo
function editList(wl) {
    document.getElementById("btn").innerHTML = "Save";
    input.value = List[wl].value;
    EditList = wl;
}

// Function to delete a todo
function deleteList(wl) {
    document.getElementById("id01").style.display = "block";
    var removeValue = document.getElementById("deleteValue");
    removeValue.addEventListener("click", function (event) {
        List = List.filter((h, index) => wl != index);
        listLength -= 1;
        addingTodo();

        if (listLength == 0) {
            List = [];
            localStorage.setItem("List", JSON.stringify(List));
        }

        localStorage.setItem("List", JSON.stringify(List));
        msgText = "Todo has been deleted";
        popupNotification(1, msgText);
        document.getElementById("id01").style.display = "none";
    });
}

// Popup notification function
function popupNotification(msg, msgText) {
    const toast = document.createElement("div");

    if (msg == 0) {
        toast.classList.add("toast");
        toast.textContent = msgText;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 2300);
    } else {
        let toast2 = document.getElementById("toast2");
        document.getElementById("msgTetxt").innerHTML = msgText;
        toast2.classList.add("toast-active");
        document.getElementById("toastCloseBtn").addEventListener("click", function () {
            toast2.classList.remove("toast-active");
        });
    }
}

// Function to close the confirmation dialog
function formClose() {
    document.getElementById("id01").style.display = "none";
}
