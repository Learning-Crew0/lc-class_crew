const path = require("path");
const fs = require("fs");
const config = require("./env");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const BASE_UPLOAD_PATH = IS_PRODUCTION
    ? "/var/data/files"
    : path.join(__dirname, "../../uploads");

const UPLOAD_FOLDERS = {
    COURSES: "courses",
    INSTRUCTORS: "instructors",
    PROMOTIONS: "promotions",
    NOTICES: "notices",
    REVIEWS: "reviews",
    CATEGORIES: "categories",
    CERTIFICATES: "certificates",
    ANNOUNCEMENTS: "announcements",
    APPLICATIONS: "applications",
    COALITIONS: "coalitions",
    TEMP: "temp",
};

const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const initializeStorage = () => {
    ensureDirectoryExists(BASE_UPLOAD_PATH);

    Object.values(UPLOAD_FOLDERS).forEach((folder) => {
        const folderPath = path.join(BASE_UPLOAD_PATH, folder);
        ensureDirectoryExists(folderPath);
    });
};

const getUploadPath = (folderType) => {
    return path.join(
        BASE_UPLOAD_PATH,
        UPLOAD_FOLDERS[folderType] || UPLOAD_FOLDERS.TEMP
    );
};

const getFileUrl = (folderType, filename) => {
    if (!filename) return null;
    const relativeUrl = `/uploads/${UPLOAD_FOLDERS[folderType]}/${filename}`;
    // Generate full URL for cross-origin access
    return `${config.serverUrl}${relativeUrl}`;
};

const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
};

const deleteFileByUrl = (fileUrl) => {
    if (!fileUrl) return false;

    // Handle both full URLs and relative URLs
    let relativePath = fileUrl;
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
        // Extract relative path from full URL
        const url = new URL(fileUrl);
        relativePath = url.pathname;
    }

    relativePath = relativePath.replace("/uploads/", "");
    const filePath = path.join(BASE_UPLOAD_PATH, relativePath);
    return deleteFile(filePath);
};

module.exports = {
    BASE_UPLOAD_PATH,
    UPLOAD_FOLDERS,
    ensureDirectoryExists,
    initializeStorage,
    getUploadPath,
    getFileUrl,
    deleteFile,
    deleteFileByUrl,
};
