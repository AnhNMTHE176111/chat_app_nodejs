const express = require("express");
const { JWT_SECRET } = require("../helpers/const");
const jwt = require("jsonwebtoken");
const AuthorizationMiddleware = express.Router();

AuthorizationMiddleware.verifyJWT = (req, res, next) => {
    const accessToken = req.signedCookies.access_token;
    if (!accessToken) {
        return res.sendError("Access token is missing", 401);
    }
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.sendError(err.message);
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = AuthorizationMiddleware;
