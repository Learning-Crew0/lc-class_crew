const express = require("express");
const router = express.Router();

// Controllers
const coursesController = require("../controllers/courses.controller");
const productsController = require("../controllers/products.controller");
const faqsController = require("../controllers/faqs.controller");
const noticesController = require("../controllers/notices.controller");
const bannersController = require("../controllers/banners.controller");
const inquiriesController = require("../controllers/inquiries.controller");

// Validators
const { validate } = require("../middlewares/validate.middleware");
const { createInquirySchema } = require("../validators/inquiry.validators");
const { markHelpfulSchema } = require("../validators/faq.validators");

// Middleware
const { optionalAuth } = require("../middlewares/auth.middleware");

// === COURSES ===
// GET /api/v1/public/courses - Get all published courses
router.get("/courses", (req, res, next) => {
    req.query.publicOnly = true;
    coursesController.getAllCourses(req, res, next);
});

// GET /api/v1/public/courses/featured - Get featured courses
router.get("/courses/featured", coursesController.getFeatured);

// GET /api/v1/public/courses/:id - Get course by ID or slug
router.get("/courses/:id", coursesController.getCourseById);

// === PRODUCTS ===
// GET /api/v1/public/products - Get all published products
router.get("/products", (req, res, next) => {
    req.query.publicOnly = true;
    productsController.getAllProducts(req, res, next);
});

// GET /api/v1/public/products/featured - Get featured products
router.get("/products/featured", productsController.getFeatured);

// GET /api/v1/public/products/:id - Get product by ID or slug
router.get("/products/:id", productsController.getProductById);

// === FAQs ===
// GET /api/v1/public/faqs - Get all published FAQs
router.get("/faqs", (req, res, next) => {
    req.query.publicOnly = true;
    faqsController.getAllFAQs(req, res, next);
});

// GET /api/v1/public/faqs/category/:category - Get FAQs by category
router.get("/faqs/category/:category", faqsController.getByCategory);

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

// POST /api/v1/public/banners/:id/impression - Track banner impression
router.post("/banners/:id/impression", bannersController.trackImpression);

// POST /api/v1/public/banners/:id/click - Track banner click
router.post("/banners/:id/click", bannersController.trackClick);

// === INQUIRIES ===
// POST /api/v1/public/inquiries - Submit inquiry (optional auth)
router.post(
    "/inquiries",
    optionalAuth,
    validate(createInquirySchema),
    inquiriesController.createInquiry
);

module.exports = router;
