require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { initializeApp } = require("firebase/app");
const cors = require("cors");

const indexRouter = require("./api/v1/routes/index");
const {
    API_VERSION,
    COOKIE_SECRET,
    CLIENT_URL,
} = require("./api/v1/helpers/const.js");
const {
    firebaseConfig,
    corsConfig,
    connectToMongoDB,
    catchNotFound,
    ErrorHandler,
    corsPreflight,
    redisClient,
} = require("./config");
const { ResponseHelper } = require("./api/v1/helpers/response.helper.js");
const passport = require("passport");

const app = express();

// config project
app.options("*", cors());
app.use(corsPreflight);
app.use(corsConfig);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
    next();
});
initializeApp(firebaseConfig);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(ResponseHelper);
// app.use(expressSessionConfig);
app.use(passport.initialize());

// set routes
app.use(API_VERSION, indexRouter);
app.get("/", function (req, res, next) {
    res.json(
        "Thiên lý ơi\n" +
            "Em có thể ở lại đây không\n" +
            "Biết chăng ngoài trời mưa giông\n" +
            "Nhiều cô đơn lắm em"
    );
});
// catch 404 and forward to error handler
app.use(catchNotFound);
// error handler
app.use(ErrorHandler);

connectToMongoDB();
redisClient.monitor((err, monitor) => {
    monitor.on("monitor", (time, args, source, database) =>
        console.log("redis monitor", time, args, source, database)
    );
    monitor.on("error", (channel, message) => console.log(channel, message));
});

module.exports = app;
