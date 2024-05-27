const API_VERSION = "/api/v1";
const SALT_ROUNDS = 10;
const PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES = 5;

const JWT_TTL = process.env.JWT_TTL;
const JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL;
const CLIENT_URL = process.env.CLIENT_URL;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
    API_VERSION,
    SALT_ROUNDS,
    CLIENT_URL,
    PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES,
    JWT_TTL,
    JWT_REFRESH_TTL,
    COOKIE_SECRET,
    JWT_SECRET,
};
