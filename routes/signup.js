"use strict";

const express = require("express");
const mongodb = require("mongodb");
const $ = require("jquery");
const _ = require("lodash");


const MongoClient = mongodb.MongoClient;
const router = express.Router();

router.get("/", (request, response) => {
    response.render("signup");
});

router.post("/", (request, response) => {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, (err, db) => {
        if (err) {
            throw err;
        }

        //Removing preceding and trailing whitespaces
        _.mapValues(request.body, _.trim);

        let database = db.db("database");
        const query = {
            $or: [
                { username: request.body.username },
                { email: request.body.email }
            ]
        };

        database.collection("users").findOne(query).then((result) => {
            if (!_.isEmpty(result)) {
                response.render("signup");

                return;
            }

            let passwordValidity = {};

            checkPasswordCriteria(request.body.password, request.body.passwordReenter, passwordValidity);

            if (!_.isEmpty(passwordValidity)) {
                response.render("signup");

                return;
            }

            //Add new user
            let newUser = {
                username: request.body.username,
                password: request.body.password,
                email: request.body.email
            };

            database.collection("users").insertOne(newUser);

            db.close();
            response.redirect("/");
        }).catch((error) => {
            //Should not happen
            db.close();
            throw error;
        });
    });
});

function checkPasswordCriteria(password, passwordReenter, passwordValidity) {
    //Check if both passwords match
    if (password !== passwordReenter) {
        passwordValidity.message = "Password mismatch";
        passwordValidity.isValid = false;

        return;
    }

    //Check if password is long enough
    if (password.length < 9) {
        passwordValidity.message = "Password too short";
        passwordValidity.isValid = false;
    }

    //Check if password has enough of each character type
    let digitCount = 0;
    let letterCount = 0;
    let specialCount = 0;

    for (let char of password) {
        //Check if letter
        if (/^[a-zA-Z]$/.test(char)) {
            letterCount++;
            continue;
        }

        //Check if digit
        if (/^[0-9]$/.test(char)) {
            digitCount++;
            continue;
        }

        //Check if special character
        if (/^[!|@|#|$|%|^|&|*|-|_|+|=|?|.]$/.test(char)) {
            specialCount++;
            continue;
        }
    }

    if (digitCount < 4 || letterCount < 4 || specialCount < 1) {
        passwordValidity.message = "Password must have at least 4 digits, 4 letters and one special character";
        passwordValidity.isValid = false;

        return;
    }
}


module.exports = router;
