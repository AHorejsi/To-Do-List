"use strict";

const express = require("express");
const mongodb = require("mongodb");
const _ = require("lodash");


const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

router.post("/", (request, response) => {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, (err, db) => {
        if (err) {
            response.redirect("error");
            return;
        }

        _.mapValues(request.body, _.trim);

        const database = db.db("database");

        database.collection("tasks").insertOne({
            userId: ObjectId(request.cookies.userId),
            description: request.body.newTaskText
        }).then((outcome) => {
            if (outcome.result.ok === 1) {
                response.redirect("mainPage");
            }
            else {
                response.redirect("error");
            }
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
