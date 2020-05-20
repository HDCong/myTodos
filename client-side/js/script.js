let listTaskTodo = []
const serverUrl = 'https://hdcong-todolist.herokuapp.com/todolist'
    // const serverUrl = 'http://localhost:8888/todolist'
const input = document.getElementById("input-task")
var workingList = document.getElementById("working-list")
const xhttp = new XMLHttpRequest();

const LINE_THROUGH = 'lineThrough'
var btnAdd = document.getElementById("btn-add")
btnAdd.addEventListener('click', addWork)

var modalConfirm = document.getElementsByClassName("modal")[0]
var btnConfirmYes = document.getElementsByClassName("btn-confirmYes")[0]
btnConfirmYes.addEventListener('click', confirmToRemoveTask)

var isConfirmed = false
var targetElement

var btnSubmitNew = document.getElementsByClassName("btn-submit-new")[0]
btnSubmitNew.addEventListener('click', editDataTask)
var newEditContent = document.getElementById('new-content')
var newEditStatus

// Add listener for element
document.addEventListener('keyup', function(ev) {
    if (ev.keyCode == 13) {
        if (input === document.activeElement) {
            const taskTodo = input.value
            if (taskTodo) {
                addWork();
            }
        } else if (newEditContent === document.activeElement) {
            console.log(newEditContent.value)
            var idTask = targetElement.attributes.id.value;
            updateNewData(idTask, targetElement)
            $('#btn-cancel-modal').click();
        }

    }
})
workingList.addEventListener('click', function(ev) {
    targetElement = ev.target
    var job = targetElement.attributes.job.value
    var idTask = targetElement.attributes.id.value;
    if (job == 'done') {
        updateStatusData(idTask, targetElement)
    } else if (job == 'remove') {
        addAttributeToModal(idTask)
    } else if (job == 'change') {
        addAttributeToModal(idTask)
    }
})


loadData()

// Get and render data
function loadData() {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            listTaskTodo = JSON.parse(this.responseText);
            loadList(listTaskTodo)
        }
    };
    xhttp.open("GET", serverUrl, true);
    xhttp.send();
}

function loadList(array) {
    array.forEach(function(item) {
        addTaskTodo(item.content, item.id, item.isdone)
    });
}

// Add new data and render

function addWork() {

    const taskTodo = input.value
    if (taskTodo) {
        postNewTaskToDB(taskTodo)
    }
    input.value = ''
}

function postNewTaskToDB(taskTodo) {
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 201) {
            // Change in listTodo
            listTaskTodo.push({ id: parseInt(this.responseText), content: taskTodo, isdone: false })
            addTaskTodo(taskTodo, this.responseText, false)
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };
    var newContent = taskTodo
    var newStt = false
    var params = 'content=' + newContent + '&isdone=' + newStt;
    // console.log(params)
    xhttp.open("POST", serverUrl, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}
// Render new data
function addTaskTodo(taskContent, id, done) {
    // console.log(taskContent, id, done)
    var line = done ? LINE_THROUGH : ''
    var checked = done ? 'checkedJob' : ''
    var text = `<li class ="ui-state-default list-group-item-action ${checked}" id="${id}">
                    <p class ="task-content ${line}" job='done' id="${id}" >  ${taskContent} </p>
                    <i class = "trash fa fa-trash ${checked}" id="${id}" job='remove' data-toggle="modal" data-target="#myConfirm" ></i>
                    <i class="edit fa fa-pencil-square-o" job='change' id="${id}" aria-hidden="true" data-toggle="modal" data-target="#my-submit"></i>
                </li>
                `
    position = 'afterbegin'
    workingList.insertAdjacentHTML(position, text)
}


// Edit data
function editDataTask() {
    var idTask = modalConfirm.getAttribute("id-to-handle")
    console.log(targetElement)
    updateNewData(idTask, targetElement)
    modalConfirm.removeAttribute('id-to-handle')
}
// Update data when click icon edit: can be change content or status
function updateNewData(id, element) {
    var taskById = listTaskTodo.find(x => x.id == id)
        // console.log(taskById)
    var newContent = newEditContent.value
    if (!newContent) newContent = taskById.content
    newEditStatus = document.getElementsByName('status')[0].checked ? true : false
    var line = newEditStatus ? LINE_THROUGH : ''
    var text = ` <p class ="task-content ${line}" job='done' id="${id}" >  ${newContent} </p>`
    var oldStt = taskById.isdone
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            taskById.isdone = newEditStatus
            taskById.content = newContent
            targetElement.parentNode.firstElementChild.innerHTML = text
            if (oldStt != newEditStatus)
                doneTask(element.parentNode.firstElementChild)
            newEditContent.value = ''
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };
    var params = 'content=' + newContent + '&isdone=' + newEditStatus;
    console.log(params)
    xhttp.open("PUT", serverUrl + '/' + id, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}
// Update status when click p : just change status, not change content
function updateStatusData(id, element) {
    var taskById = listTaskTodo.find(x => x.id == id)
    var newContent = taskById.content
    var newStt = taskById.isdone ? false : true
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            taskById.isdone = newStt
            doneTask(element)
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };
    var params = 'content=' + newContent + '&isdone=' + newStt;
    console.log(params)
    xhttp.open("PUT", serverUrl + '/' + id, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

// render new value of data
function doneTask(element) {
    element.parentNode.classList.toggle('checkedJob')
    element.classList.toggle(LINE_THROUGH)
}


// Add id to handle modal
function addAttributeToModal(id) {
    modalConfirm.setAttribute('id-to-handle', id)
}


// Remove task 
function confirmToRemoveTask() {
    var idTask = modalConfirm.getAttribute("id-to-handle")
    removeTaskFromDB(idTask, targetElement)
    modalConfirm.removeAttribute('id-to-handle')
}

function removeTaskFromDB(id, element) {

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // change in list to do
            listTaskTodo = listTaskTodo.filter(function(val) { return val.id != id })
            removeTask(element)
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };

    xhttp.open("DELETE", serverUrl + '/' + id, true);
    xhttp.send();
}

function removeTask(taskElement) {
    taskElement.parentNode.classList.toggle('faded')
    $(taskElement).parent().fadeOut('slow', function() {
        taskElement.parentNode.parentNode.removeChild(taskElement.parentNode)
    })
}