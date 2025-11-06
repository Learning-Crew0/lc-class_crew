const mongoose = require("mongoose");
const Admin = require("../models/admin.model");
const config = require("../config/env");
const logger = require("../config/logger");

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongodb.uri);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
            email: config.admin.email,
        });

        if (existingAdmin) {
            logger.info("Admin user already exists");
            process.exit(0);
        }

        // Create admin user
        const admin = await Admin.create({
            email: config.admin.email,
            password: config.admin.password,
            name: "System Administrator",
            role: "admin",
            isActive: true,
        });

        logger.info("Admin user created successfully:");
        logger.info(`Email: ${admin.email}`);
        logger.info(`Password: ${config.admin.password}`);
        logger.info("⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        logger.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};

seedAdmin();
