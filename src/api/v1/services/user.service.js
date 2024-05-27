const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { JWT_TTL, JWT_REFRESH_TTL, CLIENT_URL } = require("../helpers/const");

const createToken = (value, timeToLive) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    const tokenExpireAt = moment().add(timeToLive, "seconds");
    const token = jwt.sign({ value }, jwtSecretKey, {
        expiresIn: '1d',
    });
    return {
        token: token,
        tokenExpireAt: tokenExpireAt,
    };
};

const setUserAccessToken = (user, res) => {
    const accessToken = createToken(user._id, JWT_TTL);
    user.accessToken = accessToken.token;
    user.tokenExpireAt = accessToken.tokenExpireAt;
    res.cookie("access_token", user.accessToken, {
        expires: accessToken.tokenExpireAt.toDate(),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
    });
    return accessToken;
};

const setUserRefreshToken = (user) => {
    const refreshToken = createToken(user._id, JWT_REFRESH_TTL);
    user.refreshToken = refreshToken.token;
    user.refreshTokenExpireAt = refreshToken.tokenExpireAt;
    return refreshToken;
};

module.exports = {
    setUserAccessToken,
    setUserRefreshToken,
    createToken,
};
