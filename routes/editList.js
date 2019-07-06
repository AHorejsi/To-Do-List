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

        database.collection("tasks").find({ userId: ObjectId(request.cookies.userId) }).forEach((doc) => {
            const changeType = request.body["task" + doc._id.toString()];

            if (changeType === "edit") {
                const query = { _id: doc._id };
                const updateInfo = {
                    $set: {
                        description: request.body["description" + doc._id.toString()]
                    }
                };

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
