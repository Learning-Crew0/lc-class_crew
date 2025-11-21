const multer = require("multer");
const path = require("path");
const config = require("../config/env");
const { getUploadPath, UPLOAD_FOLDERS } = require("../config/fileStorage");

const createStorage = (folderType) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = getUploadPath(folderType);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            const sanitizedFieldname = file.fieldname.replace(
                /[^a-zA-Z0-9]/g,
                "_"
            );
            cb(null, `${sanitizedFieldname}-${uniqueSuffix}${ext}`);
        },
    });
};

const fileFilter = (req, file, cb) => {
    const allowedTypes = config.upload?.allowedTypes || [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
};

const excelFileFilter = (req, file, cb) => {
    const allowedExcelTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
    ];

    if (allowedExcelTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only Excel files (.xls, .xlsx) and CSV files are allowed"
            ),
            false
        );
    }
};

const createUpload = (folderType, customFilter = null) => {
    return multer({
        storage: createStorage(folderType),
        fileFilter: customFilter || fileFilter,
        limits: {
            fileSize: config.upload?.maxFileSize || 10 * 1024 * 1024,
        },
    });
};

const createExcelUpload = (folderType) => {
    return multer({
        storage: createStorage(folderType),
        fileFilter: excelFileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB limit for Excel files
        },
    });
};

const uploadSingle = (folderType, fieldName) => {
    return createUpload(folderType).single(fieldName);
};

const uploadMultiple = (folderType, fieldName, maxCount = 10) => {
    return createUpload(folderType).array(fieldName, maxCount);
};

const uploadFields = (folderType, fields) => {
    return createUpload(folderType).fields(fields);
};

const courseUploads = uploadFields("COURSES", [
    { name: "mainImage", maxCount: 1 },
    { name: "hoverImage", maxCount: 1 },
    { name: "noticeImage", maxCount: 1 },
    { name: "promotionImages", maxCount: 5 },
]);

const promotionUploads = uploadMultiple("PROMOTIONS", "images", 10);

const instructorUploads = uploadSingle("INSTRUCTORS", "profileImage");

const noticeUploads = uploadSingle("NOTICES", "noticeImage");

const reviewUploads = uploadSingle("REVIEWS", "avatar");

const categoryUploads = uploadSingle("CATEGORIES", "icon");

const classApplicationUploads =
    createExcelUpload("APPLICATIONS").single("participantsFile");

// Coalition file filter - allow documents, images, and archives
const coalitionFileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Documents
        "application/pdf",
        "application/x-hwp",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        // Archives
        "application/zip",
        "application/x-zip-compressed",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Allowed: pdf, hwp, doc, docx, ppt, pptx, xls, xlsx, jpg, jpeg, png, zip"
            ),
            false
        );
    }
};

const coalitionUploads = multer({
    storage: createStorage("COALITIONS"),
    fileFilter: coalitionFileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024, // 15MB limit for coalition files
    },
}).single("file");

// Announcement file filter - allow images, PDF, and Excel files
const announcementFileFilter = (req, file, cb) => {
    const allowedTypes = [
        // Images
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        // PDF
        "application/pdf",
        // Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "지원하지 않는 파일 형식입니다. 이미지(JPG, PNG, GIF, WebP), PDF, Excel 파일만 업로드 가능합니다."
            ),
            false
        );
    }
};

const announcementUploads = multer({
    storage: createStorage("ANNOUNCEMENTS"),
    fileFilter: announcementFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
    },
}).array("attachments", 5); // Allow up to 5 files

module.exports = {
    uploadSingle,
    uploadMultiple,
    uploadFields,
    courseUploads,
    promotionUploads,
    instructorUploads,
    noticeUploads,
    reviewUploads,
    categoryUploads,
    classApplicationUploads,
    coalitionUploads,
    announcementUploads,
    UPLOAD_FOLDERS,
};
