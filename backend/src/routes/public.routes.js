const express = require("express");
const router = express.Router();

// Controllers
const coursesController = require("../controllers/courses.controller");
const productsController = require("../controllers/products.controller");
const faqController = require("../controllers/faq.controller");
const faqsController = require("../controllers/faqs.controller");
const noticesController = require("../controllers/notices.controller");
const bannersController = require("../controllers/banners.controller");
const inquiriesController = require("../controllers/inquiries.controller");
const usersController = require("../controllers/users.controller");
const categoryController = require("../controllers/category.controller");

// Validators
const { validate } = require("../middlewares/validate.middleware");
const { 
    createInquirySchema,
    personalInquirySchema,
    corporateInquirySchema,
} = require("../validators/inquiry.validators");
const { markHelpfulSchema } = require("../validators/faq.validators");

// Middleware
const { optionalAuth } = require("../middlewares/auth.middleware");

// === CATEGORIES & POSITIONS ===
// GET /api/v1/public/categories - Get all categories
router.get("/categories", categoryController.getAllCategories);

// GET /api/v1/public/positions - Get all positions
router.get("/positions", categoryController.getAllPositions);

// === COURSES ===
// GET /api/v1/public/courses/search - Search courses by category and/or position
router.get("/courses/search", coursesController.searchCourses);

// GET /api/v1/public/courses/category/:slug - Get courses by category (navbar filtering)
router.get("/courses/category/:slug", coursesController.getCoursesByCategory);

// GET /api/v1/public/courses - Get all published courses
router.get("/courses", (req, res, next) => {
    req.query.isActive = true;
    coursesController.getAllCourses(req, res, next);
});

// GET /api/v1/public/courses/featured - Get featured courses
router.get("/courses/featured", (req, res, next) => {
    req.query.isActive = true;
    req.query.isFeatured = true;
    coursesController.getAllCourses(req, res, next);
});

// GET /api/v1/public/courses/:id - Get course by ID or slug
router.get("/courses/:id", coursesController.getCourseById);

// === PRODUCTS ===
// GET /api/v1/public/products - Get all published products
router.get("/products", (req, res, next) => {
    req.query.publicOnly = true;
    productsController.getAllProducts(req, res, next);
});

// GET /api/v1/public/products/:id - Get product by ID or slug
router.get("/products/:id", productsController.getProductById);

// === FAQ CATEGORIES ===
// GET /api/v1/public/faq-categories - Get all FAQ categories (no filtering)
router.get("/faq-categories", faqController.getAllFAQCategories);

// GET /api/v1/public/faq-categories/:id - Get FAQ category by ID
router.get("/faq-categories/:id", faqController.getFAQCategoryById);

// === FAQs ===
// GET /api/v1/public/faqs - Get all FAQs (no approval filtering)
router.get("/faqs", faqsController.getAllFAQs);

// GET /api/v1/public/faqs/:id - Get FAQ by ID
router.get("/faqs/:id", faqsController.getFAQById);

// POST /api/v1/public/faqs/:id/helpful - Mark FAQ as helpful
router.post(
    "/faqs/:id/helpful",
    validate(markHelpfulSchema),
    faqsController.markHelpful
);

// === NOTICES ===
// GET /api/v1/public/notices - Get all published notices
router.get("/notices", (req, res, next) => {
    req.query.publicOnly = true;
    noticesController.getAllNotices(req, res, next);
});

// GET /api/v1/public/notices/:id - Get notice by ID
router.get("/notices/:id", noticesController.getNoticeById);

// === BANNERS ===
// GET /api/v1/public/banners - Get all active banners
router.get("/banners", (req, res, next) => {
    req.query.publicOnly = true;
    bannersController.getAllBanners(req, res, next);
});

// === INQUIRIES ===
// POST /api/v1/public/inquiries - Submit inquiry (optional auth)
router.post(
    "/inquiries",
    optionalAuth,
    validate(createInquirySchema),
    inquiriesController.createInquiry
);

// POST /api/v1/public/inquiries/personal - Submit personal inquiry
router.post(
    "/inquiries/personal",
    validate(personalInquirySchema),
    inquiriesController.createPersonalInquiry
);

// POST /api/v1/public/inquiries/corporate - Submit corporate inquiry
router.post(
    "/inquiries/corporate",
    validate(corporateInquirySchema),
    inquiriesController.createCorporateInquiry
);

// === USERS ===
// GET /api/v1/public/users/verify-by-email - Verify user exists by email
router.get("/users/verify-by-email", usersController.verifyByEmail);

module.exports = router;
