const moment = require("moment");
const jwt = require("jsonwebtoken");
const { JWT_TTL, JWT_REFRESH_TTL } = require("../helpers/const");
const User = require("../models/user.model");

const createToken = (value, timeToLive) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ value }, jwtSecretKey, {
        expiresIn: timeToLive,
    });
    const tokenExpireAt = moment().add(timeToLive, "seconds");
    return {
        token: token,
        tokenExpireAt: tokenExpireAt,
    };
};

const setUserAccessToken = async (user) => {
    const accessToken = createToken(user._id, JWT_TTL);
    user.accessToken = accessToken.token;
    user.tokenExpireAt = accessToken.tokenExpireAt;
};

const setUserRefreshToken = async (user) => {
    const refreshToken = createToken(user._id, JWT_REFRESH_TTL);
    user.refreshToken = refreshToken.token;
    user.refreshTokenExpireAt = refreshToken.tokenExpireAt;
};

module.exports = {
    setUserAccessToken,
    setUserRefreshToken,
    createToken,
};
