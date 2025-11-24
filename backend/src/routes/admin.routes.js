const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("../controllers/admin.controller");
const usersController = require("../controllers/users.controller");
const coursesController = require("../controllers/courses.controller");
const enrollmentController = require("../controllers/enrollment.controller");
const productsController = require("../controllers/products.controller");
const productCategoriesController = require("../controllers/productCategories.controller");
const inquiriesController = require("../controllers/inquiries.controller");
const noticesController = require("../controllers/notices.controller");
const faqController = require("../controllers/faq.controller");
const faqsController = require("../controllers/faqs.controller");
const bannersController = require("../controllers/banners.controller");
const uploadsController = require("../controllers/uploads.controller");
const settingsController = require("../controllers/settings.controller");
const messagesController = require("../controllers/messages.controller");
const migrationController = require("../controllers/migration.controller");

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
    updateStockSchema,
} = require("../validators/product.validators");
const {
    createProductCategorySchema,
    updateProductCategorySchema,
} = require("../validators/productCategory.validators");
const {
    createNoticeSchema,
    updateNoticeSchema,
} = require("../validators/notice.validators");
const {
    createFAQCategorySchema,
    updateFAQCategorySchema,
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
const {
    createMessageSchema,
    updateMessageSchema,
    getMessagesQuerySchema,
} = require("../validators/message.validators");

// Middleware
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const {
    uploadSingle,
    uploadMultiple,
    courseUploads,
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
    courseUploads, // Parse multipart FIRST (mainImage, hoverImage, noticeImage, promotionImages)
    validate(createCourseSchema),
    coursesController.createCourse
);

// PUT /api/v1/admin/courses/:id - Update course
router.put(
    "/courses/:id",
    courseUploads, // Parse multipart for image updates
    validate(updateCourseSchema),
    coursesController.updateCourse
);

// DELETE /api/v1/admin/courses/:id - Delete course
router.delete("/courses/:id", coursesController.deleteCourse);

// === ENROLLMENTS MANAGEMENT ===
// GET /api/v1/admin/enrollments - Get all enrollments (admin)
router.get("/enrollments", enrollmentController.getAllEnrollmentsAdmin);

// GET /api/v1/admin/enrollments/export - Export enrollments to Excel
router.get(
    "/enrollments/export",
    enrollmentController.exportEnrollmentsToExcel
);

// PATCH /api/v1/admin/enrollments/:enrollmentId/complete - Mark as completed
router.patch(
    "/enrollments/:enrollmentId/complete",
    enrollmentController.markEnrollmentCompleted
);

// POST /api/v1/admin/enrollments/bulk-update - Bulk update enrollments
router.post(
    "/enrollments/bulk-update",
    enrollmentController.bulkUpdateEnrollments
);

// POST /api/v1/admin/enrollments/bulk-certificates - Generate bulk certificates
router.post(
    "/enrollments/bulk-certificates",
    enrollmentController.generateBulkCertificates
);

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

// PATCH /api/v1/admin/products/:id/stock - Update stock
router.patch(
    "/products/:id/stock",
    validate(updateStockSchema),
    productsController.updateStock
);

// PATCH /api/v1/admin/products/:id/toggle-active - Toggle active status
router.patch("/products/:id/toggle-active", productsController.toggleActive);

// DELETE /api/v1/admin/products/:id - Delete product
router.delete("/products/:id", productsController.deleteProduct);

// === PRODUCT CATEGORIES MANAGEMENT ===
// GET /api/v1/admin/product-categories - Get all product categories
router.get("/product-categories", productCategoriesController.getAllCategories);

// GET /api/v1/admin/product-categories/:id - Get category by ID
router.get(
    "/product-categories/:id",
    productCategoriesController.getCategoryById
);

// POST /api/v1/admin/product-categories - Create category
router.post(
    "/product-categories",
    validate(createProductCategorySchema),
    productCategoriesController.createCategory
);

// PUT /api/v1/admin/product-categories/:id - Update category
router.put(
    "/product-categories/:id",
    validate(updateProductCategorySchema),
    productCategoriesController.updateCategory
);

// PATCH /api/v1/admin/product-categories/:id/toggle-active - Toggle active status
router.patch(
    "/product-categories/:id/toggle-active",
    productCategoriesController.toggleActive
);

// PATCH /api/v1/admin/product-categories/update-counts - Update product counts
router.patch(
    "/product-categories/update-counts",
    productCategoriesController.updateProductCounts
);

// DELETE /api/v1/admin/product-categories/:id - Delete category
router.delete(
    "/product-categories/:id",
    productCategoriesController.deleteCategory
);

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

// === FAQ CATEGORIES MANAGEMENT ===
// GET /api/v1/admin/faq-categories - Get all FAQ categories
router.get("/faq-categories", faqController.getAllFAQCategories);

// GET /api/v1/admin/faq-categories/:id - Get FAQ category by ID
router.get("/faq-categories/:id", faqController.getFAQCategoryById);

// POST /api/v1/admin/faq-categories - Create FAQ category
router.post(
    "/faq-categories",
    validate(createFAQCategorySchema),
    faqController.createFAQCategory
);

// PUT /api/v1/admin/faq-categories/:id - Update FAQ category
router.put(
    "/faq-categories/:id",
    validate(updateFAQCategorySchema),
    faqController.updateFAQCategory
);

// DELETE /api/v1/admin/faq-categories/:id - Delete FAQ category
router.delete("/faq-categories/:id", faqController.deleteFAQCategory);

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

// PATCH /api/v1/admin/banners/reorder - Reorder banners
router.patch("/banners/reorder", bannersController.reorderBanners);

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

// === MESSAGES ===
// GET /api/v1/admin/messages/statistics - Get message statistics
router.get("/messages/statistics", messagesController.getMessageStatistics);

// POST /api/v1/admin/messages - Create and send message
router.post(
    "/messages",
    validate(createMessageSchema),
    messagesController.createMessage
);

// GET /api/v1/admin/messages - Get all messages
router.get(
    "/messages",
    validate(getMessagesQuerySchema),
    messagesController.getAllMessages
);

// GET /api/v1/admin/messages/:id - Get message by ID
router.get("/messages/:id", messagesController.getMessageById);

// PUT /api/v1/admin/messages/:id - Update message
router.put(
    "/messages/:id",
    validate(updateMessageSchema),
    messagesController.updateMessage
);

// DELETE /api/v1/admin/messages/:id - Delete message (soft delete)
router.delete("/messages/:id", messagesController.deleteMessage);

// === MIGRATIONS ===
// POST /api/v1/admin/migrations/temp-images - Migrate temp images to permanent storage
router.post("/migrations/temp-images", migrationController.migrateTempImages);

module.exports = router;
