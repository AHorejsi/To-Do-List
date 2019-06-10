"use strict";

const mongodb = require("mongodb");
const _ = require("lodash");


const MongoClient = mongodb.MongoClient;

function checkForm(request, response, next) {
    let formValidity = formIsValid(request.body);
    request.signupFormValidity = formValidity;

    next();
}

function formIsValid(requestBody) {
    let formValidity = {};
    passwordCriteria(requestBody.password, requestBody.passwordReenter, formValidity);

    //If object is not empty, then invalid form submission
    if (!_.isEmpty(formValidity)) {
        return formValidity;
    }

    databaseCriteria(requestBody.username, requestBody.email, formValidity);

    //If object is not empty, then invalid form submission
    if (!_.isEmpty(formValidity)) {
        return formValidity;
    }

    formValidity.message = "Success";
    formValidity.isValid = true;

    return formValidity;
}

function passwordCriteria(password, passwordReenter, formValidity) {
    //Check if entered password is the same as re-entered password
    if (password !== passwordReenter) {
        formValidity.message = "Entered password must be the same as re-entered password";
        formValidity.isValid = false;

        return;
    }

    //Check if password meets required criteria
    let digitCount = 0;
    let letterCount = 0;
    let specialCount = 0;

    for (let char in password) {
        //Check if letter
        let letterMatch = char.match(/[a-zA-Z]/);

        if (letterMatch.index === letterMatch.input) {
            letterCount++;
            continue;
        }

        //Check if digit
        let digitMatch = char.match(/[0-9]/);

        if (digitMatch.index === digitMatch.input) {
            digitCount++;
            continue;
        }

        //Check if special character
        let specialMatch = char.match(/[!|@|#|$|%|^|&|*|-|_|+|=|?|.]/);

        if (specialMatch.index === specialMatch.input) {
            specialCount++;
            continue;
        }
    }

    //Check if meets approriate criteria
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


module.exports = checkForm;
