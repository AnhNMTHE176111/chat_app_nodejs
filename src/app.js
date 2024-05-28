const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./api/v1/routes/index");
const connectToMongoDB = require("./config/database.config.js");
const { ResponseHelper } = require("./api/v1/helpers/response.helper.js");
const {
    API_VERSION,
    CLIENT_URL,
    COOKIE_SECRET,
} = require("./api/v1/helpers/const.js");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./config/firebase.config.js");

const app = express();

initializeApp(firebaseConfig);
app.use(
    cors({
        origin: [CLIENT_URL],
        credentials: true,
    })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(ResponseHelper);

// set routes
app.use(API_VERSION, indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render("error");
});

connectToMongoDB();

module.exports = app;
