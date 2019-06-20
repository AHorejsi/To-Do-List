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

        let database = db.db("database");

        database.collection("tasks").insertOne({
            userId: ObjectId(request.cookies.userId),
            description: request.body.newTaskText
        });

        response.redirect("mainPage");
        db.close();
    });
});


module.exports = router;
