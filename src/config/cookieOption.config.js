const { CLIENT_URL } = require("../api/v1/helpers/const");

const cookieOption = {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
};

module.exports = cookieOption;
