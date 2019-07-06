"use strict";

const express = require("express");
const mongodb = require("mongodb");
const _ = require("lodash");


const MongoClient = mongodb.MongoClient;
const router = express.Router();

router.get("/", (request, response) => {
    response.render("signup", {
        username: request.cookies.username,
        email: request.cookies.email,
        usernameInUse: request.cookies.usernameInUse,
        emailInUse: request.cookies.emailInUse,
        passwordValidity: request.cookies.passwordValidity,
        passwordMessage: request.cookies.passwordMessage
    });
});

router.post("/", (request, response) => {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, (err, db) => {
        if (err) {
            response.redirect("error");
            return;
        }

        _.mapValues(request.body, _.trim);

        let database = db.db("database");
        const query = {
            $or: [
                { username: request.body.username },
                { email: request.body.email }
            ]
        };

        database.collection("users").find(query).toArray().then((documents) => {
            let formIsValid = true;

            if (!_.isEmpty(documents)) {
                const usernameInUse = _.findIndex(documents, (doc) => doc.username === request.body.username) !== -1;
                const emailInUse = _.findIndex(documents, (doc) => doc.email === request.body.email) !== -1;

                response.cookie("usernameInUse", usernameInUse);
                response.cookie("emailInUse", emailInUse);

                if (usernameInUse || emailInUse) {
                    formIsValid = false;
                }
            }

            const passwordValidity = checkPasswordCriteria(request.body.password, request.body.passwordReenter);
            response.cookie("passwordValidity", passwordValidity.isValid);
            response.cookie("passwordMessage", passwordValidity.message);

            if (!passwordValidity.isValid) {
                formIsValid = false;
            }

            response.cookie("username", request.body.username);
            response.cookie("email", request.body.email);

            if (formIsValid) {
                response.clearCookie("usernameInUse");
                response.clearCookie("emailInUse");
                response.clearCookie("passwordValidity");
                response.clearCookie("passwordMessage");

                const newUser = {
                    username: request.body.username,
                    password: request.body.password,
                    email: request.body.email
                };

                database.collection("users").insertOne(newUser);

                response.redirect("/");
            }
            else {
                response.redirect("signup");
            }
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});

function checkPasswordCriteria(password, passwordReenter) {
    let passwordValidity = {
        message: "",
        isValid: true
    };

    if (password !== passwordReenter) {
        passwordValidity.message += "Passwords do not match";
        passwordValidity.isValid = false;
    }

    if (password.length < 9) {
        passwordValidity.message += "<br>Password too short";
        passwordValidity.isValid = false;
    }

    let digitCount = 0;
    let letterCount = 0;
    let specialCount = 0;

    for (let char of password) {
        if (/^[a-zA-Z]$/.test(char)) {
            letterCount++;
            continue;
        }

        if (/^[0-9]$/.test(char)) {
            digitCount++;
            continue;
        }

        if (/^[!|@|#|$|%|^|&|*|-|_|+|=|?|.]$/.test(char)) {
            specialCount++;
            continue;
        }
    }

    if (digitCount < 4 || letterCount < 4 || specialCount < 1) {
        passwordValidity.message += "<br>Password must have at least 4 digits, 4 letters and one special character";
        passwordValidity.isValid = false;
    }

    return passwordValidity;
}


module.exports = router;
