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

module.exports = connectToMongoDB;
