const cors = require("cors");
const { CLIENT_URL } = require("../api/v1/helpers/const");

const corsConfig = cors({
    origin: [CLIENT_URL, "https://master.d2qxs7vz3gtesz.amplifyapp.com", "http://localhost:3000"],
    credentials: true,
});

module.exports = corsConfig;
