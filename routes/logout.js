"use strict";

const express = require("express");


const router = express.Router();

router.get("/", (request, response) => {
    response.clearCookie("userId");
    response.clearCookie("tasks");
    console.log(request.cookies);
    response.redirect("/");
});


module.exports = router;
