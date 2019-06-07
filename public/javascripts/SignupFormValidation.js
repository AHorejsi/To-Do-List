"use strict";

const mongodb = require("mongodb");
const _ = require("lodash");


const MongoClient = mongodb.MongoClient;

function formIsValid(username, password, passwordReenter, email) {
    let formValidity = {};
    passwordCriteria(password, passwordReenter, formValidity);

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
    const digitRegex = ;
    const specialRegex = ;

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

        //Check if special
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


module.exports = formIsValid;
