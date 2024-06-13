const session = require("express-session");
const { redisClient } = require("./database.config");
const { default: RedisStore } = require("connect-redis");
const { COOKIE_SECRET } = require("../api/v1/helpers/const");

const expressSessionConfig = session({
    store: new RedisStore({ client: redisClient }),
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: null,
    },
});

module.exports = expressSessionConfig;
