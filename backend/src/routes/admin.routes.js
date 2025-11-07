const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("../controllers/admin.controller");
const usersController = require("../controllers/users.controller");
const coursesController = require("../controllers/courses.controller");
const enrollmentsController = require("../controllers/enrollments.controller");
const productsController = require("../controllers/products.controller");
const inquiriesController = require("../controllers/inquiries.controller");
const noticesController = require("../controllers/notices.controller");
const faqsController = require("../controllers/faqs.controller");
const bannersController = require("../controllers/banners.controller");
const uploadsController = require("../controllers/uploads.controller");
const settingsController = require("../controllers/settings.controller");

// Validators
const { validate } = require("../middlewares/validate.middleware");
const { adminLoginSchema } = require("../validators/auth.validators");
const {
    createAdminSchema,
    updateAdminSchema,
    updateAdminStatusSchema,
    updateAdminPasswordSchema,
} = require("../validators/admin.validators");
const {
    registerSchema,
    updateUserSchema,
} = require("../validators/user.validators");
const {
    createCourseSchema,
    updateCourseSchema,
} = require("../validators/course.validators");
const {
    createProductSchema,
    updateProductSchema,
} = require("../validators/product.validators");
const {
    createNoticeSchema,
    updateNoticeSchema,
} = require("../validators/notice.validators");
const {
    createFAQSchema,
    updateFAQSchema,
} = require("../validators/faq.validators");
const {
    createBannerSchema,
    updateBannerSchema,
} = require("../validators/banner.validators");
const {
    createSettingSchema,
    updateSettingSchema,
} = require("../validators/settings.validators");

// Middleware
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const {
    uploadSingle,
    uploadMultiple,
} = require("../middlewares/upload.middleware");

router.post("/login", validate(adminLoginSchema), adminController.login);

router.use(authenticate, requireAdmin);

router.get("/profile", adminController.getProfile);

router.put(
    "/password",
    validate(updateAdminPasswordSchema),
    adminController.updateAdminPassword
);

router.get("/admins", adminController.getAllAdmins);

router.get("/admins/:id", adminController.getAdminById);

router.post(
    "/admins",
    validate(createAdminSchema),
    adminController.createAdmin
);

router.put(
    "/admins/:id",
    validate(updateAdminSchema),
    adminController.updateAdmin
);

router.delete("/admins/:id", adminController.deleteAdmin);

router.patch(
    "/admins/:id/status",
    validate(updateAdminStatusSchema),
    adminController.updateAdminStatus
);

// === USERS MANAGEMENT ===
// GET /api/v1/admin/users - Get all users
router.get("/users", usersController.getAllUsers);

// GET /api/v1/admin/users/:id - Get user by ID
router.get("/users/:id", usersController.getUserById);

router.post("/users", validate(registerSchema), usersController.createUser);

router.put(
    "/users/:id",
    validate(updateUserSchema),
    usersController.updateUser
);

// DELETE /api/v1/admin/users/:id - Delete user
router.delete("/users/:id", usersController.deleteUser);

// === COURSES MANAGEMENT ===
// GET /api/v1/admin/courses - Get all courses
router.get("/courses", coursesController.getAllCourses);

// GET /api/v1/admin/courses/:id - Get course by ID
router.get("/courses/:id", coursesController.getCourseById);

// POST /api/v1/admin/courses - Create course
router.post(
    "/courses",
    validate(createCourseSchema),
    coursesController.createCourse
);

// PUT /api/v1/admin/courses/:id - Update course
router.put(
    "/courses/:id",
    validate(updateCourseSchema),
    coursesController.updateCourse
);

// DELETE /api/v1/admin/courses/:id - Delete course
router.delete("/courses/:id", coursesController.deleteCourse);

// === ENROLLMENTS MANAGEMENT ===
// Note: Enrollment routes moved to /api/v1/enrollments (see courses.routes.js)

// === PRODUCTS MANAGEMENT ===
// GET /api/v1/admin/products - Get all products
router.get("/products", productsController.getAllProducts);

// GET /api/v1/admin/products/:id - Get product by ID
router.get("/products/:id", productsController.getProductById);

// POST /api/v1/admin/products - Create product
router.post(
    "/products",
    validate(createProductSchema),
    productsController.createProduct
);

// PUT /api/v1/admin/products/:id - Update product
router.put(
    "/products/:id",
    validate(updateProductSchema),
    productsController.updateProduct
);

// DELETE /api/v1/admin/products/:id - Delete product
router.delete("/products/:id", productsController.deleteProduct);

// === INQUIRIES MANAGEMENT ===
// GET /api/v1/admin/inquiries - Get all inquiries
router.get("/inquiries", inquiriesController.getAllInquiries);

// GET /api/v1/admin/inquiries/:id - Get inquiry by ID
router.get("/inquiries/:id", inquiriesController.getInquiryById);

// DELETE /api/v1/admin/inquiries/:id - Delete inquiry
router.delete("/inquiries/:id", inquiriesController.deleteInquiry);

// === NOTICES MANAGEMENT ===
// GET /api/v1/admin/notices - Get all notices
router.get("/notices", noticesController.getAllNotices);

// GET /api/v1/admin/notices/:id - Get notice by ID
router.get("/notices/:id", noticesController.getNoticeById);

// POST /api/v1/admin/notices - Create notice
router.post(
    "/notices",
    validate(createNoticeSchema),
    noticesController.createNotice
);

// PUT /api/v1/admin/notices/:id - Update notice
router.put(
    "/notices/:id",
    validate(updateNoticeSchema),
    noticesController.updateNotice
);

// DELETE /api/v1/admin/notices/:id - Delete notice
router.delete("/notices/:id", noticesController.deleteNotice);

// === FAQS MANAGEMENT ===
// GET /api/v1/admin/faqs - Get all FAQs
router.get("/faqs", faqsController.getAllFAQs);

// GET /api/v1/admin/faqs/:id - Get FAQ by ID
router.get("/faqs/:id", faqsController.getFAQById);

// POST /api/v1/admin/faqs - Create FAQ
router.post("/faqs", validate(createFAQSchema), faqsController.createFAQ);

// PUT /api/v1/admin/faqs/:id - Update FAQ
router.put("/faqs/:id", validate(updateFAQSchema), faqsController.updateFAQ);

// DELETE /api/v1/admin/faqs/:id - Delete FAQ
router.delete("/faqs/:id", faqsController.deleteFAQ);

// === BANNERS MANAGEMENT ===
// GET /api/v1/admin/banners - Get all banners
router.get("/banners", bannersController.getAllBanners);

// GET /api/v1/admin/banners/:id - Get banner by ID
router.get("/banners/:id", bannersController.getBannerById);

// POST /api/v1/admin/banners - Create banner
router.post(
    "/banners",
    validate(createBannerSchema),
    bannersController.createBanner
);

// PUT /api/v1/admin/banners/:id - Update banner
router.put(
    "/banners/:id",
    validate(updateBannerSchema),
    bannersController.updateBanner
);

// DELETE /api/v1/admin/banners/:id - Delete banner
router.delete("/banners/:id", bannersController.deleteBanner);

// === UPLOADS ===
// POST /api/v1/admin/uploads/single - Upload single file
router.post(
    "/uploads/single",
    uploadSingle("TEMP", "file"),
    uploadsController.uploadSingle
);

// POST /api/v1/admin/uploads/multiple - Upload multiple files
router.post(
    "/uploads/multiple",
    uploadMultiple("TEMP", "files", 10),
    uploadsController.uploadMultiple
);

// DELETE /api/v1/admin/uploads/:filename - Delete file
router.delete("/uploads/:filename", uploadsController.deleteFile);

// GET /api/v1/admin/uploads/:filename - Get file info
router.get("/uploads/:filename", uploadsController.getFileInfo);

// === SETTINGS ===
// GET /api/v1/admin/settings - Get all settings
router.get("/settings", settingsController.getAllSettings);

// GET /api/v1/admin/settings/:key - Get setting by key
router.get("/settings/:key", settingsController.getSettingByKey);

// POST /api/v1/admin/settings - Create setting
router.post(
    "/settings",
    validate(createSettingSchema),
    settingsController.createSetting
);

// PUT /api/v1/admin/settings/:key - Update setting
router.put(
    "/settings/:key",
    validate(updateSettingSchema),
    settingsController.updateSetting
);

// DELETE /api/v1/admin/settings/:key - Delete setting
router.delete("/settings/:key", settingsController.deleteSetting);

module.exports = router;
