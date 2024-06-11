const cors = require("cors");
const { CLIENT_URL } = require("../api/v1/helpers/const");

console.log("CLIENT_URL", CLIENT_URL);
const corsConfig = cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
    credentials: true,
});

module.exports = corsConfig;
