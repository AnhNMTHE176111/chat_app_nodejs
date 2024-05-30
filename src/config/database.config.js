const { Redis } = require("ioredis");
const mongoose = require("mongoose");

async function connectToMongoDB() {
    const uri = process.env.DB_MONGO_URI;
    try {
        console.log("MongoDB Connecting...");
        await mongoose.connect(uri);
        console.log("Connect to MongoDB Success");
    } catch (error) {
        console.log(error.message);
    }
}

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
})
    .on("connecting", () => console.log("Connecting Redis...."))
    .on("connect", () => console.log("Connect to Redis Success"))
    .on("error", (error) => console.log("Connect to Redis Fail:", error));

module.exports = { connectToMongoDB, redisClient };
