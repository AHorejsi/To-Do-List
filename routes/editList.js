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

        console.log(request.body);

        database.collection("tasks").find({ userId: ObjectId(request.cookies.userId) }).forEach((doc) => {
            let changeType = request.body["editTask" + doc._id.toString()];

            if (changeType === "edit") {
                let query = { _id: doc._id };
                let updateInfo = { $set: { description: request.body["description" + doc._id.toString()] } }

                database.collection("tasks").updateOne(query, updateInfo);
            }
            else if (changeType === "delete") {
                database.collection("tasks").deleteOne({ _id: doc._id });
            }
        }).then((result) => {
            response.redirect("mainPage");
        }).catch((error) => {
            response.redirect("error");
        }).finally(() => {
            db.close();
        });
    });
});


module.exports = router;
