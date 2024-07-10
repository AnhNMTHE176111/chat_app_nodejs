require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./api/v1/routes/index");
const { API_VERSION, COOKIE_SECRET } = require("./api/v1/helpers/const.js");
const {
    corsConfig,
    connectToMongoDB,
    catchNotFound,
    ErrorHandler,
<<<<<<< HEAD
    // redisClient,
=======
    redisClient,
    firebaseConfig,
>>>>>>> 5fd20ded641a58fc182ac759a9bb6ab6cadb6fd9
} = require("./config");
const { ResponseHelper } = require("./api/v1/helpers/response.helper.js");
const passport = require("passport");
const { app, io } = require("./api/v1/socket/socket.js");

// config project
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(express.static(path.join(__dirname, "public")));
app.use(corsConfig);
app.use(ResponseHelper);
app.use(passport.initialize());

// set routes
app.use(API_VERSION, indexRouter);
app.get("/", function (req, res, next) {
    res.json(
        "Thiên lý ơi! Em có thể ở lại đây không? Biết chăng ngoài trời mưa giông, nhiều cô đơn lắm em~~~"
    );
});
// catch 404 and forward to error handler
app.use(catchNotFound);
// error handler
app.use(ErrorHandler);

connectToMongoDB();
// redisClient.monitor((err, monitor) => {
//     monitor.on("monitor", (time, args, source, database) =>
//         console.log("redis monitor", time, args, source, database)
//     );
//     monitor.on("error", (channel, message) => console.log(channel, message));
// });

module.exports = app;
