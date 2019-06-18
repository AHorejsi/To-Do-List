"use strict";


const express = require("express");
const router = express.Router();


router.get("/", (request, response) => {
    response.render("mainPage");
});


module.exports = router;