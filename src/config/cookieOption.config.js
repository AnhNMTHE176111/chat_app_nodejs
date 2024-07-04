const { CLIENT_URL } = require("../api/v1/helpers/const");

const cookieOption = {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
};

module.exports = cookieOption;
