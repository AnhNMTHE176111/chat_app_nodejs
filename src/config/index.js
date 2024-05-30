const cookieOption = require("./cookieOption.config");
const corsConfig = require("./cors.config");
const { redisClient, connectToMongoDB } = require("./database.config");
const { ErrorHandler, catchNotFound } = require("./errorHandler.config");
const expressSessionConfig = require("./expresSession.config");
const { firebaseConfig } = require("./firebase.config");
const { mailTransporter } = require("./nodemailer.config");

module.exports = {
    connectToMongoDB,
    redisClient,
    mailTransporter,
    firebaseConfig,
    expressSessionConfig,
    catchNotFound,
    ErrorHandler,
    corsConfig,
    cookieOption
};
