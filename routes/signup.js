"use strict";

const express = require("express");
const _ = require("lodash");
const checkForm = require("../public/javascripts/SignupFormValidation");


const router = express.Router();
router.use(checkForm);

router.get("/", (request, response) => {
    response.render("signup");
});

router.post("/", (request, response) => {
    const username = request.body.username.trim();
    const password = request.body.password.trim();
    const passwordReenter = request.body.passwordReenter.trim();
    const email = request.body.email.trim();

    console.log(request.body);
    console.log(request.signupFormValidity);

    response.redirect("/");
});


module.exports = router;
