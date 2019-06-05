"use strict";

const _ = require("lodash");
const Task = require("./Task");


function ToDoList() {
    this.listOfTasks = [];

    this.addTask = function(task) {
        this.listOfTasks.push(task);
    }

    this.createTask = function(description, timeToSendEmail) {
        this.addTask(new Task(description, timeToSendEmail))
    }

    this.removeTaskByIndex = function(index) {
        this.listOfTasks.splice(index, 1);
    }

    this.removeTaskByValue = function(task) {
        this.listOfTasks = _.remove(this.listOfTasks, (item) => {
            return item !== task;
        });
    }
}


module.exports = ToDoList;
