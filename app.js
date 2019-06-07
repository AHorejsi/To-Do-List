"use strict";


const debug = require("debug");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const title = require("./routes/title");
//const login = require("./routes/login");
const signup = require("./routes/signup");
//const main = require("./routes/main");
const users = require("./routes/users");

const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", title);
//app.use("/login", login);
app.use("/signup", signup);
//app.use("/main", main);
app.use("/users", users);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
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
