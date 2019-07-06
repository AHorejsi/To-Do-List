"use strict";

const express = require("express");
const mongodb = require("mongodb");


const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

router.get("/", (request, response) => {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, (err, db) => {
        if (err || request.cookies.userId === undefined) {
            response.redirect("error");
            return;
        }

        let database = db.db("database");

        database.collection("tasks").find({ userId: ObjectId(request.cookies.userId) }).toArray().then((tasks) => {
            response.render("mainPage", {
                tasks
            });
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
