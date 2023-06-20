//Select form
var form = document.getElementById("form");
//getting input form inputfield
var input = document.getElementById("input");
//getting id to listing value in html
var forward = document.getElementById("list");
var forward2  =document.getElementById("completedList")
//Getting the data form localstorage
let list = JSON.parse(localStorage.getItem('list')) || [];
let listLength = list.length;
let completedList = JSON.parse(localStorage.getItem('completedList')) || [];
let completedListLength = completedList.length;
//array to store
let EditList = -1;
// Passing empty value for toast message
let msgText;
//Calling function to getvalue in localstorage
addingTodo();
//
listCompleted();

//submit
form.addEventListener('submit', function (event) {
    event.preventDefault();
    //Calling function to add into list
    add();
    //Calling function to viewing list in html
    addingTodo();
    //
    listCompleted();
    //Adding the data into local storage
    localStorage.setItem('list', JSON.stringify(list));
    localStorage.setItem('completedList',JSON.stringify(completedList));
});

//-----------------         Function to add a value               ------------------
function add() {
    let inputValue = input.value;
    //checking duplicate value
    var isDuplicate = list.some((store) => store.value.toUpperCase() == inputValue.toUpperCase());
    //Checking the input is empty or not empty
    if (inputValue.length == 0) {
        msgText = "Your entered empty text!!!!!!!!";
        popupNotification(0, msgText);
    }
    //Checking the duplicate value before storig list
    else if (isDuplicate) {
        if (EditList >= 0) {
            input.value = '';
            document.getElementById('btn').innerHTML = "+";
            msgText = "There is no changes in your todo";
            popupNotification(1, msgText);
        }
        else {
            msgText = "This value already entered in list";
            popupNotification(0, msgText);
        }
    }
    //Adding and editing
    else {
        if (EditList >= 0) {
            list = list.map((q, index) => ({
                ...q,
                value: index == EditList ? inputValue : q.value,
            }))
            EditList = -1;
            // Changing the button "+" after saving the value
            document.getElementById('btn').innerHTML = "+";
            // Clearing the inputfield after edting the value
            input.value = '';
            msgText = "Changes has been saved in list";
            popupNotification(1, msgText);
        }
        else {
            // To store the value
            list.push({
                value: inputValue,
                checked: false
            });
            // Clearing the Inputfield after entering the value
            input.value = '';
            listLength += 1;
            msgText = "Your new todo has been added";
            popupNotification(1, msgText);
        }
    }
}

// --------------                 Functio to add a todo's --------------------------------------------
function addingTodo() {
    if (list.length == 0) {
        forward.innerHTML = '<center style="font-size:x-large;">Your Todo List has been empty</center>';
        document.getElementById('taskValue').innerHTML = "Tasks - " + completedListLength;
        return;
    }
    // Clear the list before enter the value
    forward.innerHTML = '';
    // Adding values to list
    list.forEach((todo, index) => {
        if(todo.checked == true){
            console.log(todo.index);
            completedList.push(todo);
            list.pop(todo);
            localStorage.setItem('list', JSON.stringify(list));
            localStorage.setItem('completedList', JSON.stringify(completedList));
            document.getElementById('taskValue').innerHTML = "Task -  " + listLength;
            document.getElementById('completedListLength').innerHTML = "Completed -  " + completedListLength;
            
        }
        forward.innerHTML += `
        <div class="listview" id=${index}>
        <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'} check"
        data-action="check"
        ></i> 
        <p data-action="check">${todo.value}</p>
        <button class="btnedit bi bi-pencil-square" data-action="edit"></button>
        <button class="btndelete bi bi-trash" data-action="delete"></button>          
        </div>`;
    }
    );
    // Showing length in list
    if (listLength > 0) {
        document.getElementById('taskValue').innerHTML = "Task -  " + listLength;
    }
}

function listCompleted(){
    if (completedList.length == 0) {
        forward2.innerHTML = '<center style="font-size:x-large;">Your Todo List has been empty</center>';
        document.getElementById('completedListLength').innerHTML = "Completed - " + completedListLength;
        return;
    }
    // Clear the list before enter the value
    forward2.innerHTML = '';
    // Adding values to list
    completedList.forEach((todo, index) => {
        forward2.innerHTML += `
        <div class="listview" id=${index}>
        <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'} check"
        data-action="check"
        ></i> 
        <p class="${todo.checked ? 'checked' : ' '}" data-action="check">${todo.value}</p>
        </div>`;
    }
    );
    // Showing length in list
    if (completedListLength > 0) {
        document.getElementById('completedListLength').innerHTML = "Completed -  " + completedListLength;
    }
    addingTodo();
}

//------------------------------       AddEventListener for edit and delete in listView     --------------------------
forward.addEventListener('click', (event) => {
    var target = event.target;
    var click = target.parentNode;
    if (click.className != 'listview') return;
    // Getting id to Edit or Delete the value in list
    var wl = click.id;
    // Getting action form the list button 
    var action = target.dataset.action;
    //Calling function to Edit nor delete
    action == 'check' && checkList(wl);
    action == 'edit' && editList(wl);
    action == 'delete' && deleteList(wl);
});

// -------------------------------      Completed Function                                 ------------------------------------------

function checkList(wl) {
    list = list.map((todo, index) => ({
        ...todo,
        checked: index == wl ? !todo.checked : todo.checked,
    }));
    addingTodo();
    listCompleted();
}
    
    


// ------------------------------            Editlist function          --------------------------------------------
function editList(wl) {
    document.getElementById('btn').innerHTML = "save";
    input.value = list[wl].value;
    EditList = wl;
}

//------------------------           Deleting Function while delete a value in list          --------------------------
function deleteList(wl) {
    var con = confirm("Are you sure you want to delete this todo?");
    //Checking condition is true or false
    if (con) {
        list = list.filter((h, index) => wl != index);
        //Calling Function changes in list
        listLength -= 1;
        addingTodo();
        if (listLength == 0) {
            document.getElementById('listValue').innerHTML = " ";
        }
        msgText = "Todo has been deleted";
        popupNotification(1, msgText)
        localStorage.setItem('list', JSON.stringify(list));
    }
}

//----------------------     Popup message ----------------------------
function popupNotification(msg, msgText) {
    const toast = document.createElement('div')
    if (msg == 0) {
        toast.classList.add('toast');
        toast.textContent = msgText;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1300);
    }
    else {
        toast.classList.add('toast2');
        toast.textContent = msgText;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1300);
    }
}

function myFunction(){
    var x = document.getElementById("sidebar");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}