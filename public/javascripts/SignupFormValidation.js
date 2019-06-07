"use strict";

const mongodb = require("mongodb");
const _ = require("lodash");


const MongoClient = mongodb.MongoClient;

function formIsValid(username, password1, password2, email) {
    let formValidity = {};
    passwordCriteria(password1, password2, formValidity);

    if (!_.isEmpty(formValidity)) {
        return formValidity;
    }

    databaseCriteria(username, email, formValidity);

    if (!_.isEmpty(formValidity)) {
        return formValidity;
    }

    formValidity.message = "Success";
    formValidity.isValid = true;

    return formValidity;
}

function passwordCriteria(password1, password2, formValidity) {
    //Check if entered password is the same as re-entered password
    if (password1 !== password2) {
        formValidity.message = "Entered password must be the same as re-entered password";
        formValidity.isValid = false;

        return;
    }

    //Check if password meets required criteria
    let digitCount = 0;
    let letterCount = 0;
    let specialCount = 0;

    _.forEach(password1, (char) => {
        if (char.match(/[a-zA-Z]/)) {
            letterCount++;
        }

        if (char.match(/[0-9]/)) {
            digitCount++;
        }

        if (char.match(/[!|@|#|$|%|^|&|*|-|_|+|=|?|.]/)) {
            specialCount++;
        }
    });

    if (digitCount < 4 || letterCount < 4 || specialCount < 1) {
        formValidity.message = "Password must have at least 4 digits, 4 letters and one special character";
        formValidity.isValid = false;

        return;
    }
}

function databaseCriteria(username, password, formValidity) {
    //Check database if username is already in use
    //Check database if email is already in use
}