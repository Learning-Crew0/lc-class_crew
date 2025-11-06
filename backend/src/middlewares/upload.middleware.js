const multer = require("multer");
const path = require("path");
const fs = require("fs");
const config = require("../config/env");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../", config.upload.uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.upload.maxFileSize,
    },
});

/**
 * Upload single file
 */
const uploadSingle = (fieldName) => upload.single(fieldName);

/**
 * Upload multiple files
 */
const uploadMultiple = (fieldName, maxCount = 10) =>
    upload.array(fieldName, maxCount);

/**
 * Upload multiple fields
 */
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadFields,
    upload,
};
