const path = require("path");
const fs = require("fs");

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
    return `/uploads/${UPLOAD_FOLDERS[folderType]}/${filename}`;
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

    const relativePath = fileUrl.replace("/uploads/", "");
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
