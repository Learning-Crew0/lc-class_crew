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
    UPLOAD_FOLDERS,
};
