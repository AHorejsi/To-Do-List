"use strict";

const debug = require("debug");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const title = require("./routes/title");
const login = require("./routes/login");
const signup = require("./routes/signup");
const mainPage = require("./routes/mainPage");
const error = require("./routes/error");
const addTask = require("./routes/addTask");
const editList = require("./routes/editList");
const logout = require("./routes/logout");
const deleteUser = require("./routes/deleteUser");


const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", title);
app.use("/login", login);
app.use("/signup", signup);
app.use("/mainPage", mainPage);
app.use("/error", error);
app.use("/addTask", addTask);
app.use("/editList", editList);
app.use("/logout", logout);
app.use("/deleteUser", deleteUser);

// catch 404 and forward to error handler
app.use((request, response, next) => {
    let error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use((error, request, response, next) => {
        response.status(error.status || 500);
        response.render("error", {
            message: error.message,
            error
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.render("error", {
        message: error.message,
        error: {}
    });
});

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
    debug("Express server listening on port " + server.address().port);
});
