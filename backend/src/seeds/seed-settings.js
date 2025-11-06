const mongoose = require("mongoose");
const Settings = require("../models/settings.model");
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

const defaultSettings = [
    {
        key: "site_name",
        value: "LC Class Crew",
        description: "Website name",
        category: "general",
        isPublic: true,
    },
    {
        key: "site_description",
        value: "Professional learning management and e-commerce platform",
        description: "Website description",
        category: "general",
        isPublic: true,
    },
    {
        key: "contact_email",
        value: "contact@lcclasscrew.com",
        description: "Contact email address",
        category: "general",
        isPublic: true,
    },
    {
        key: "contact_phone",
        value: "+1 (555) 123-4567",
        description: "Contact phone number",
        category: "general",
        isPublic: true,
    },
    {
        key: "support_email",
        value: "support@lcclasscrew.com",
        description: "Support email address",
        category: "general",
        isPublic: true,
    },
    {
        key: "maintenance_mode",
        value: false,
        description: "Enable maintenance mode",
        category: "general",
        isPublic: false,
    },
    {
        key: "registration_enabled",
        value: true,
        description: "Allow user registration",
        category: "security",
        isPublic: true,
    },
    {
        key: "default_currency",
        value: "USD",
        description: "Default currency",
        category: "payment",
        isPublic: true,
    },
];

const seedSettings = async () => {
    try {
        await connectDB();

        for (const setting of defaultSettings) {
            const exists = await Settings.findOne({ key: setting.key });

            if (!exists) {
                await Settings.create(setting);
                logger.info(`Created setting: ${setting.key}`);
            } else {
                logger.info(`Setting already exists: ${setting.key}`);
            }
        }

        logger.info("Settings seeded successfully");
        process.exit(0);
    } catch (error) {
        logger.error("Error seeding settings:", error.message);
        process.exit(1);
    }
};

seedSettings();
