const path = require("path");
const fs = require("fs").promises;
const config = require("../config/env");

/**
 * Process uploaded file
 */
const processUpload = async (file) => {
    if (!file) {
        throw new Error("No file uploaded");
    }

    // For local storage, return the file path
    if (config.storage.type === "local") {
        return {
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            url: `/uploads/${file.filename}`,
            path: file.path,
        };
    }

    // For S3/Render storage, implement upload logic here
    // This is a placeholder for cloud storage integration
    if (config.storage.type === "s3") {
        // TODO: Implement S3 upload
        throw new Error("S3 storage not yet implemented");
    }

    throw new Error("Invalid storage type");
};

/**
 * Process multiple uploaded files
 */
const processMultipleUploads = async (files) => {
    if (!files || files.length === 0) {
        throw new Error("No files uploaded");
    }

    const uploadedFiles = await Promise.all(
        files.map((file) => processUpload(file))
    );

    return uploadedFiles;
};

/**
 * Delete file
 */
const deleteFile = async (filename) => {
    if (!filename) {
        throw new Error("Filename is required");
    }

    if (config.storage.type === "local") {
        const filePath = path.join(
            __dirname,
            "../../",
            config.upload.uploadDir,
            filename
        );

        try {
            await fs.unlink(filePath);
            return { message: "File deleted successfully" };
        } catch (error) {
            if (error.code === "ENOENT") {
                throw new Error("File not found");
            }
            throw error;
        }
    }

    // For S3/Render storage
    if (config.storage.type === "s3") {
        // TODO: Implement S3 delete
        throw new Error("S3 storage not yet implemented");
    }

    throw new Error("Invalid storage type");
};

/**
 * Get file info
 */
const getFileInfo = async (filename) => {
    if (!filename) {
        throw new Error("Filename is required");
    }

    if (config.storage.type === "local") {
        const filePath = path.join(
            __dirname,
            "../../",
            config.upload.uploadDir,
            filename
        );

        try {
            const stats = await fs.stat(filePath);
            return {
                filename,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                url: `/uploads/${filename}`,
            };
        } catch (error) {
            if (error.code === "ENOENT") {
                throw new Error("File not found");
            }
            throw error;
        }
    }

    throw new Error("Invalid storage type");
};

module.exports = {
    processUpload,
    processMultipleUploads,
    deleteFile,
    getFileInfo,
};
