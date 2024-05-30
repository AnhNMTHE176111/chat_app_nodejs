const cors = require("cors");
const { CLIENT_URL } = require("../api/v1/helpers/const");

const corsConfig = cors({
    origin: [CLIENT_URL],
    credentials: true,
});

module.exports = corsConfig;
