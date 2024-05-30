const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { initializeApp } = require("firebase/app");

const indexRouter = require("./api/v1/routes/index");
const { API_VERSION, COOKIE_SECRET } = require("./api/v1/helpers/const.js");
const {
    firebaseConfig,
    corsConfig,
    connectToMongoDB,
    catchNotFound,
    ErrorHandler,
    expressSessionConfig,
    redisClient,
} = require("./config");
const { ResponseHelper } = require("./api/v1/helpers/response.helper.js");

const app = express();

// config project
initializeApp(firebaseConfig);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(corsConfig);
app.use(ResponseHelper);
app.use(expressSessionConfig);

// set routes
app.use(API_VERSION, indexRouter);
// catch 404 and forward to error handler
app.use(catchNotFound);
// error handler
app.use(ErrorHandler);

connectToMongoDB();
redisClient.monitor((err, monitor) => {
    monitor.on("monitor", (time, args, source, database) =>
        console.log(time, args, source, database)
    );
    monitor.on("error", (channel, message) => console.log(channel, message));
});

module.exports = app;
