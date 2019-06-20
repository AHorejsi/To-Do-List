"use strict";

const express = require("express");
const mongodb = require("mongodb");


const router = express.Router();
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

router.post("/", (request, response) => {
    MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true }, (err, db) => {
        if (err) {
            response.redirect("error");
            return;
        }

        let database = db.db("database");

        database.collection("tasks").deleteOne({ _id: ObjectId(request.query.taskId) }).then((result) => {
            response.redirect("mainPage");
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
