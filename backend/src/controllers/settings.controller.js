const Settings = require("../models/settings.model");
const { successResponse } = require("../utils/response.util");

/**
 * Get all settings
 */
const getAllSettings = async (req, res, next) => {
    try {
        const filter = {};

        // If not admin, only show public settings
        if (req.user?.role !== "admin") {
            filter.isPublic = true;
        }

        const settings = await Settings.find(filter).sort({
            category: 1,
            key: 1,
        });
        return successResponse(
            res,
            settings,
            "Settings retrieved successfully"
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Get setting by key
 */
const getSettingByKey = async (req, res, next) => {
    try {
        const setting = await Settings.findOne({ key: req.params.key });

        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }

        // Check if user can access this setting
        if (!setting.isPublic && req.user?.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Access denied",
            });
        }

        return successResponse(res, setting, "Setting retrieved successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Create setting
 */
const createSetting = async (req, res, next) => {
    try {
        const setting = await Settings.create(req.body);
        return successResponse(
            res,
            setting,
            "Setting created successfully",
            201
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Update setting
 */
const updateSetting = async (req, res, next) => {
    try {
        const setting = await Settings.findOneAndUpdate(
            { key: req.params.key },
            req.body,
            { new: true, runValidators: true }
        );

        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }

        return successResponse(res, setting, "Setting updated successfully");
    } catch (error) {
        next(error);
    }
};

/**
 * Delete setting
 */
const deleteSetting = async (req, res, next) => {
    try {
        const setting = await Settings.findOneAndDelete({
            key: req.params.key,
        });

        if (!setting) {
            return res.status(404).json({
                status: "error",
                message: "Setting not found",
            });
        }

        return successResponse(res, null, "Setting deleted successfully");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllSettings,
    getSettingByKey,
    createSetting,
    updateSetting,
    deleteSetting,
};
