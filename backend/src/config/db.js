const mongoose = require("mongoose");
const config = require("./env");
const logger = require("./logger");

const connectDB = async () => {
    try {
        const uri =
            config.env === "test" ? config.mongodb.testUri : config.mongodb.uri;

        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(uri, options);

        logger.info(`MongoDB connected: ${mongoose.connection.host}`);

        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected");
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed through app termination");
            process.exit(0);
        });
    } catch (error) {
        logger.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
