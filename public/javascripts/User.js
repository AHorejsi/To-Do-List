"use strict";


function User(username, password, email, toDoList = []) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.toDoList = toDoList;

    this.addTask = function(task) {
        this.toDoList.addTask(task);
    }

    this.createTask = function(description, timeToSendEmail) {
        this.addTask(new Task(description, timeToSendEmail))
    }

    this.removeTaskByIndex = function(index) {
        this.toDoList.removeTaskByIndex(index);
    }

    this.removeTaskByValue = function(task) {
        this.toDoList.removeTaskByValue(task);
    }
}


module.exports = User;
