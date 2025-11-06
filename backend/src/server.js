const app = require("./app");
const config = require("./config/env");
const logger = require("./config/logger");
const connectDB = require("./config/db");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error("UNCAUGHT EXCEPTION! Shutting down...");
    logger.error({ name: err.name, message: err.message, stack: err.stack });
    process.exit(1);
});

// Connect to database
connectDB();

// Start server
const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on port ${config.port}`);
    logger.info(
        `API v${config.apiVersion} available at http://localhost:${config.port}/api/${config.apiVersion}`
    );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error("UNHANDLED REJECTION! Shutting down...");
    logger.error({ name: err.name, message: err.message, stack: err.stack });
    server.close(() => {
        process.exit(1);
    });
});

// Graceful shutdown
process.on("SIGTERM", () => {
    logger.info("SIGTERM received. Shutting down gracefully...");
    server.close(() => {
        logger.info("Process terminated!");
    });
});

module.exports = server;
