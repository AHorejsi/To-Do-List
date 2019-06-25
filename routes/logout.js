"use strict";

const express = require("express");


const router = express.Router();

router.get("/", (request, response) => {
    response.clearCookie("userId");
    response.clearCookie("tasks");
    response.clearCookie("username");
    response.clearCookie("email");

    response.redirect("/");
});


module.exports = router;
