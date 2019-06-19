"use strict";

const express = require("express");
const mongodb = require("mongodb");
const _ = require("lodash");


const router = express.Router();
const MongoClient = mongodb.MongoClient;

router.get("/", (request, response) => {
    response.render("login", {
        username: request.cookies.username,
        invalidLogin: request.cookies.invalidLogin
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
            $and: [
                {
                    $or: [
                        { username: request.body.usernameOrEmail },
                        { email: request.body.usernameOrEmail}
                    ]
                },
                { password: request.body.password }
            ]
        };
        
        database.collection("users").findOne(query).then((user) => {
            if (user === null) {
                response.cookie("invalidLogin", true);
                response.redirect("login");
            }
            else {
                const queryForTasks = {
                    _id: user._id
                };

                database.collection("tasks").find(queryForTasks).toArray().then((documents) => {
                    response.cookie("tasks", documents);
                    response.redirect("mainPage");
                }).catch((error) => {
                    response.redirect("error");
                }).finally(() => {
                    db.close();
                });
            }
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
