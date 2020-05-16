# myTodos - simple web application to build a todo list.

## client side

Simple todo app build in HTML, CSS, JavaScript

Link deployed to heroku: https://hdcong-todos.herokuapp.com/

### Feature

* Add new task to DB

* Mark a task is complete or not

* Delete a task 

The above features using AJAX to work with server in background

## server side

Simple RESTful API with Node using an Express server and PostgreSQL database

Link deployed to heroku: https://hdcong-todolist.herokuapp.com/

### Functional

https://hdcong-todolist.herokuapp.com/todolist

* Get all todo task from DB (GET request)

* Add a new task to DB (POST request)

* Update task in DB (PUT request)

* Delete task in DB (DELETE request)

To get the connection URL of your Heroku Postgres: heroku config:get DATABASE_URL

Use this connection URL to create the Pool will help you avoid the certificate error



