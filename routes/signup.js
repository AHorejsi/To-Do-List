"use strict";

const express = require("express");
const mongodb = require("mongodb");
const formIsValid = require("../public/javascripts/SignupFormValidation");


const router = express.Router();
const MongoClient = mongodb.MongoClient;

router.get("/", (request, response) => {
    response.render("signup");
});

router.post("/", (request, response) => {
    let username = request.params.username.trim();
    let password = request.params.password.trim();
    let passwordReenter = request.params.password2.trim();
    let email = request.params.email.trim();

    let formValidity = formIsValid(username, password, passwordReenter, email);

    if (formValidity.isValid) {
        //Add new user to database

        return response.redirect("/login");
    }
    else {

    }
});


module.exports = router;
