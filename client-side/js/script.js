let listTaskTodo = []
const serverUrl = 'https://hdcong-todolist.herokuapp.com/todolist'
    // const serverUrl = 'http://localhost:8888/todolist'
const input = document.getElementById("input-task")
var workingList = document.getElementById("working-list")
const xhttp = new XMLHttpRequest();

const LINE_THROUGH = 'lineThrough'
var btnAdd = document.getElementById("btn-add")
btnAdd.addEventListener('click', addWork)
var flag = -1

document.addEventListener('keyup', function(ev) {
    if (ev.keyCode == 13) {
        const taskTodo = input.value
        if (taskTodo) {
            addWork();
        }
        input.value = ''
    }
})

loadData()

function loadData() {

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            listTaskTodo = JSON.parse(this.responseText);
            // console.log(listTaskTodo)
            loadList(listTaskTodo)
        }
    };
    xhttp.open("GET", serverUrl, true);
    xhttp.send();
}

function loadList(array) {
    // console.log('vao load list')
    array.forEach(function(item) {
        // console.log(item)
        addTaskTodo(item.content, item.id, item.isdone)
    });
}

// list.removeChild(list.childNodes[index])
// ul.childNodes[index].removeChild()

function addWork() {
    // console.log('add work')
    const taskTodo = input.value
        // post request to server
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

function addTaskTodo(taskContent, id, done) {
    // console.log(taskContent, id, done)
    var line = done ? LINE_THROUGH : ''
    var checked = done ? 'checkedJob' : ''
    var text = `<li class ="ui-state-default list-group-item-action ${checked}" id="${id}">
                    <p class ="task-content ${line}" job='done' id="${id}" >  ${taskContent} </p>
                    <i class = "de fa fa-trash ${checked}" id="${id}" job='remove'"> </i>
                </li>
                `
    position = 'afterbegin'
    workingList.insertAdjacentHTML(position, text)
}

workingList.addEventListener('click', function(ev) {
    var element = ev.target
        // console.log(element)
    var job = element.attributes.job.value
        // console.log('job = ', job)
    var idTask = element.attributes.id.value;
    if (job == 'done') {
        // Work with server
        // console.log(idTask)
        changeStatusTask(idTask, element);
        // doneTask(element)
    } else if (job == 'remove') {
        // Work with server
        removeTaskFromDB(idTask, element)
            // if (flag == idTask)
            // removeTask(element)
    }
})


function changeStatusTask(id, element) {
    var taskById = listTaskTodo.find(x => x.id == id)
        // console.log(taskById)
    var newContent = taskById.content
    var newStt = taskById.isdone ? false : true
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log('hihi' + id)
            // Change in listTodo
            taskById.isdone = newStt
            doneTask(element)
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };
    // var newContent = taskById.content
    //var newStt = taskById.isdone ? false : true
    var params = 'content=' + newContent + '&isdone=' + newStt;
    console.log(params)
    xhttp.open("PUT", serverUrl + '/' + id, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(params);
}

function removeTaskFromDB(id, element) {

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // change in list to do
            listTaskTodo = listTaskTodo.filter(function(val) { return val.id != id })
                // console.log(listTaskTodo)
            removeTask(element)
        } else if (this.readyState == 4 && this.status == 500) {
            console.log('The server has not completed the request')
        }
    };

    xhttp.open("DELETE", serverUrl + '/' + id, true);
    xhttp.send();
}

function removeTask(taskElement) {
    // console.log('remove task')
    // console.log(taskElement.attributes.id)

    taskElement.parentNode.classList.toggle('faded')
        // console.log(taskElement.parentNode)
    $(taskElement).parent().fadeOut('slow', function() {
        taskElement.parentNode.parentNode.removeChild(taskElement.parentNode)
    })
}

function doneTask(element) {
    // console.log('doneTask')
    // console.log(element.attributes.id)
    element.parentNode.classList.toggle('checkedJob')
    element.classList.toggle(LINE_THROUGH)
}