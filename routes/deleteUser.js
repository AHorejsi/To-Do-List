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

        database.collection("users").deleteOne({ _id: ObjectId(request.cookies.userId) }).then((outcome) => {
            response.redirect("/");
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
