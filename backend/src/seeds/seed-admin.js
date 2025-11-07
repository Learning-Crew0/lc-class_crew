const Admin = require("../models/admin.model");
const logger = require("../config/logger");

const seedAdmin = async () => {
    try {
        const adminEmail = "classcrew@admin.com";
        const adminPassword = "admin123";

        const existingAdmin = await Admin.findOne({ email: adminEmail });

        if (existingAdmin) {
            logger.info("Admin already exists");
            return;
        }

        const admin = await Admin.create({
            email: adminEmail,
            username: "classcrew_admin",
            password: adminPassword,
            fullName: "ClassCrew Administrator",
            role: "admin",
            isActive: true,
        });

        logger.info("✅ Default admin created successfully");
        logger.info(`📧 Email: ${admin.email}`);
        logger.info(`🔑 Username: ${admin.username}`);
        logger.info(`⚠️  Please change the password after first login!`);
    } catch (error) {
        logger.error("❌ Error seeding admin:", error.message);
    }
};

module.exports = seedAdmin;
