const cors = require("cors");
const { CLIENT_URL } = require("../api/v1/helpers/const");

const corsConfig = cors({
    origin: [CLIENT_URL, "http://localhost:3000"],
    credentials: true,
});

module.exports = corsConfig;
