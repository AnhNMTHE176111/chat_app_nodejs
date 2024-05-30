const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { JWT_TTL, JWT_REFRESH_TTL, JWT_SECRET } = require("../helpers/const");
const { redisClient, cookieOption } = require("../../../config");

const createToken = (payload, timeToLive) => {
    const jwtSecretKey = JWT_SECRET;
    const tokenExpireAt = moment().add(timeToLive, "seconds");
    const token = jwt.sign(payload, jwtSecretKey, {
        expiresIn: `${timeToLive}s`,
    });
    return {
        token: token,
        tokenExpireAt: tokenExpireAt,
    };
};

const setUserAccessToken = (user, res) => {
    const accessToken = createToken({ userId: user._id }, JWT_TTL);
    user.accessToken = accessToken.token;
    user.tokenExpireAt = accessToken.tokenExpireAt;
    res.cookie("access_token", user.accessToken, {
        expires: accessToken.tokenExpireAt.toDate(),
        ...cookieOption,
    });
    return accessToken;
};

const setUserRefreshToken = async (user) => {
    const refreshToken = createToken({ userId: user._id }, JWT_REFRESH_TTL);
    user.refreshToken = refreshToken.token;
    user.refreshTokenExpireAt = refreshToken.tokenExpireAt;
    try {
        const result = await redisClient.hset(user._id, {
            refresh_token: refreshToken.token,
        });
        console.log("Redis store refresh_token success", result.toString());
    } catch (error) {
        console.log("Redis store refresh_token fail", error.message);
    }
    return refreshToken;
};

module.exports = {
    setUserAccessToken,
    setUserRefreshToken,
    createToken,
};
