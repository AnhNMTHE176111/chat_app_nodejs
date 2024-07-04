const cors = require("cors");
const { CLIENT_URL } = require("../api/v1/helpers/const");

const corsConfig = cors({
    origin: CLIENT_URL,
    credentials: true,
    secure: process.env.NODE_ENV === "production",
});

module.exports = { corsConfig };
