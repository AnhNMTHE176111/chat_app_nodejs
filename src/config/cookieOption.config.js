const { CLIENT_URL } = require("../api/v1/helpers/const");

const cookieOption = {
    httpOnly: true,
    signed: true,
    sameSite: "strict",
    domain: CLIENT_URL,
    secure: true, // process.env.NODE_ENV === "production",
};

module.exports = cookieOption;
