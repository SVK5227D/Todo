//Select form
var form = document.getElementById("form");
//getting input form inputfield
var input = document.getElementById("input");
//getting id to listing value in html
var forward = document.getElementById("list");
var forward2 = document.getElementById("completedList")
//Getting the data form localstorage
let designList = JSON.parse(localStorage.getItem('designList')) || [];
let listLength3 = designList.length;
let designCompletedList = JSON.parse(localStorage.getItem('designCompletedList')) || [];
let completedListLength3 = designCompletedList.length;
//array to store
let editlisttochange = -1;
// Passing empty value for toast message
let msgText3;
//Calling function to getvalue in localstorage
addingTodo();
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
    localStorage.setItem('designList', JSON.stringify(designList));
    localStorage.setItem('designCompletedList', JSON.stringify(designCompletedList));
});

//-----------------         Function to add a value               ------------------
function add() {
    let inputValue = input.value.trim();
    //checking duplicate value
    var isDuplicate = designList.some((store) => store.value.toUpperCase() == inputValue.toUpperCase());
    //Checking the input is empty or not empty
    if (inputValue.length == 0) {
        msgText3 = "Your entered empty text!!!!!!!!";
        popupNotification(0, msgText3);
    }
    //Checking the duplicate value before storig list
    else if (isDuplicate) {
        if (editlisttochange >= 0) {
            input.value = '';
            document.getElementById('btn').innerHTML = "+";
            msgText3 = "There is no changes in your todo";
            popupNotification(1, msgText3);
        }
        else {
            msgText3 = "This value already entered in list";
            popupNotification(0, msgText3);
        }
    }
    //Adding and editing
    else {
        if (editlisttochange >= 0) {
            designList = designList.map((q, index) => ({
                ...q,
                value: index == editlisttochange ? inputValue : q.value,
            }))
            editlisttochange = -1;
            // Changing the button "+" after saving the value
            document.getElementById('btn').innerHTML = "+";
            // Clearing the inputfield after edting the value
            input.value = '';
            msgText3 = "Changes has been saved in list";
            popupNotification(1, msgText3);
        }
        else {
            // To store the value
            designList.push({
                value: inputValue,
                checked: false
            });
            // Clearing the Inputfield after entering the value
            input.value = '';
            listLength3 += 1;
            msgText3 = "Your new todo has been added";
            popupNotification(1, msgText3);
        }
    }
    
}

// --------------                 Functio to add a todo's --------------------------------------------
function addingTodo(id) {
    if (designList.length == 0) {
        forward.innerHTML = '<center class ="valueMessage">Your Todo List has been empty</center>';
        document.getElementById('taskValue').innerHTML = "Tasks - " + listLength3;
        return;
    }
    // Clear the list before enter the value
    forward.innerHTML = '';
    // Adding values to list
    designList.forEach((todo, index) => {
        if (todo.checked == true) {
            designCompletedList.push(todo);
            designList = designList.filter((h, index) => id != index);
            localStorage.setItem('designList', JSON.stringify(designList));
            localStorage.setItem('designCompletedList', JSON.stringify(designCompletedList));
            listLength3 -= 1
            completedListLength3 += 1
            document.getElementById('taskValue').innerHTML = "Task -  " + listLength3;
            console.log('List length' + listLength3);
            document.getElementById('completedListLength').innerHTML = "Completed -  " + completedListLength3;
            if (designList.length == 0) {
                forward.innerHTML = '<center class ="valueMessage">Your Todo List has been empty</center>';
                document.getElementById('taskValue').innerHTML = "Tasks - " + listLength3;
                return;
            }
        }
        forward.innerHTML += `
        <div class="listview" id=${index}>
        <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'} check"
        data-action="check"        
        ></i> 
        <p class="value" data-action="check">${todo.value}</p>
        <button id="editbutton" class="btnedit bi bi-pencil-square" data-action="edit"></button>
        <button id="deletebutton" class="btndelete bi bi-trash" data-action="delete"></button>   
        </div>`;
    }
    );
    // Showing length in list
    if (listLength3 > 0) {
        document.getElementById('taskValue').innerHTML = "Task -  " + listLength3;
    }
    // listCompleted();
}

function listCompleted(id) {
    if (designCompletedList.length == 0) {
        forward2.innerHTML = '<center class ="valueMessage">There is no Completed task</center>';
        document.getElementById('completedListLength').innerHTML = "Completed - " + completedListLength3;
        return;
    }
    // Clear the list before enter the value
    forward2.innerHTML = '';
    // Adding values to list
    designCompletedList.forEach((todo, index) => {
        if (todo.checked == false) {
            designList.push(todo);
            designCompletedList = designCompletedList.filter((h, index) => id != index);
            localStorage.setItem('designList', JSON.stringify(designList));
            localStorage.setItem('designCompletedList', JSON.stringify(designCompletedList));
            listLength3 += 1
            completedListLength3 -= 1
            document.getElementById('taskValue').innerHTML = "Task -  " + listLength3;
            console.log('List length' + listLength3);
            document.getElementById('completedListLength').innerHTML = "Completed -  " + completedListLength3;
            if (designCompletedList.length == 0) {
                forward2.innerHTML = '<center class ="valueMessage">There is no Completed task</center>';
                document.getElementById('completedListLength').innerHTML = "Completed - " + completedListLength3;
                return;
            }
        }
        forward2.innerHTML += `
        <div class="listview" id=${index}>
        <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'} check"
        data-action="checkCompleted"
        ></i> 
        <p class="${todo.checked ? 'checked' : ' '} value" data-action="check">${todo.value}</p>
        </div>`;
    }
    );
    // Showing length in list
    if (completedListLength3 > 0) {
        document.getElementById('completedListLength').innerHTML = "Completed -  " + completedListLength3;
    }
    addingTodo();
}

//------------------------------       AddEventListener for edit and delete in listView     --------------------------
forward.addEventListener('click', (event) => {
    var target = event.target;
    var click = target.parentNode;
    if (click.className != 'listview') return;
    // if(click.className != 'listview') return;
    // Getting id to Edit or Delete the value in list
    var wl = click.id;
    // Getting action form the list button 
    var action = target.dataset.action;
    //Calling function to Edit nor delete
    action == 'check' && checkList(wl);
    action == 'edit' && editlist3(wl);
    action == 'delete' && deleteList(wl);
});


forward2.addEventListener('click', (event) => {
    var target = event.target;
    var click = target.parentNode;
    if (click.className != 'listview') return;
    // Getting id to Edit or Delete the value in list
    var wl = click.id;
    // Getting action form the list button 
    var action = target.dataset.action;
    //Calling function to Edit nor delete
    action == 'checkCompleted' && completedMove(wl);
});

function completedMove(wl) {
    designCompletedList = designCompletedList.map((todo, index) => ({
        ...todo,
        checked: index == wl ? !todo.checked : todo.checked,
    }));
    addingTodo();
    listCompleted(wl);
    listCompleted();
}

// -------------------------------      Completed Function                                 ------------------------------------------

function checkList(wl) {
    designList = designList.map((todo, index) => ({
        ...todo,
        checked: index == wl ? !todo.checked : todo.checked,
    }));
    addingTodo(wl);
    listCompleted();
}

// ------------------------------            editlisttochange function          --------------------------------------------
function editlist3(wl) {
    
    document.getElementById('btn').innerHTML = '<i class="bi bi-save"></i>';
    input.value = designList[wl].value;
    editlisttochange = wl;
}

//------------------------           Deleting Function while delete a value in list          --------------------------
function deleteList(wl) {
    var con = confirm("Are you sure you want to delete this todo?");
    //Checking condition is true or false
    if (con) {
        designList = designList.filter((h, index) => wl != index);
        //Calling Function changes in list
        listLength3 -= 1;
        addingTodo();
        if (listLength3 == 0) {
            designList = [];
            localStorage.setItem('designList', JSON.stringify(designList));
        }
        msgText3 = "Todo has been deleted";
        popupNotification(1, msgText3)
        localStorage.setItem('designList', JSON.stringify(designList));
    }
}

//----------------------     Popup message ----------------------------
function popupNotification(msg, msgText3) {
    const toast = document.createElement('div')
    if (msg == 0) {
        toast.classList.add('toast');
        toast.textContent = msgText3;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1300);
    }
    else {
        toast.classList.add('toast2');
        toast.textContent = msgText3;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1300);
    }
}

document.getElementById('tasklist4').innerHTML = 'Task In Process - '+listLength3
document.getElementById('compList4').innerHTML = 'Task Completed - '+completedListLength3