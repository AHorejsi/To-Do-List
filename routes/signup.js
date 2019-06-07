"use strict";

const express = require("express");
const User = require("../public/javascripts/User");


const router = express.Router();

router.get("/", (request, response) => {
    response.render("signup");
});

router.post("/", (request, response) => {
    let username = request.params.username.trim();
    let password1 = request.params.password1.trim();
    let password2 = request.params.password2.trim();
    let email = request.params.email.trim();

    let formValidity = formIsValid(username, password1, password2, email);

    if (formValidity.isValid) {
        let newUser = new User(username, password1, email);

        //Add new user to database

        return response.redirect("/login");
    }
    else {

    }
});

function formIsValid(username, password1, password2, email) {
    let formValidity = {};
    passwordCriteria(password1, password2, formValidity);

    if (!_.isEmpty(formValidity)) {
        return formValidity;
    }

    databaseCriteria(username, email);

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

function databaseCriteria(username, password) {
    //Check database if username is already in use
    //Check database if email is already in use
}


module.exports = router;
