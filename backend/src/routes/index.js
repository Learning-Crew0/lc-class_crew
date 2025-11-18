const express = require("express");
const router = express.Router();

const publicRoutes = require("./public.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const coursesRoutes = require("./courses.routes");
const productRoutes = require("./products.routes");
const productCategoryRoutes = require("./productCategories.routes");
const categoryRoutes = require("./category.routes");
const positionRoutes = require("./position.routes");
const cartRoutes = require("./cart.routes");
const classApplicationRoutes = require("./classApplication.routes");
const enrollmentRoutes = require("./enrollment.routes");
const announcementRoutes = require("./announcement.routes");
const faqRoutes = require("./faq.routes");
const courseHistoryRoutes = require("./courseHistory.routes");
const coalitionRoutes = require("./coalition.routes");
const searchRoutes = require("./search.routes");

const authController = require("../controllers/auth.controller");
const passwordResetController = require("../controllers/passwordReset.controller");
const settingsController = require("../controllers/settings.controller");
const inquiriesController = require("../controllers/inquiries.controller");

const { authenticate } = require("../middlewares/auth.middleware");

const { validate } = require("../middlewares/validate.middleware");
const {
    registerSchema,
    loginSchema,
} = require("../validators/auth.validators");
const {
    initiatePasswordResetSchema,
    verifyCodeSchema,
    resetPasswordSchema,
    findIdSchema,
} = require("../validators/passwordReset.validators");
const { createInquirySchema } = require("../validators/inquiry.validators");

router.post(
    "/auth/register",
    validate(registerSchema),
    authController.register
);

router.post("/auth/login", validate(loginSchema), authController.login);

// Verify Member (for personal/corporate inquiry)
router.post("/auth/verify-member", authController.verifyMember);

// Find ID
router.post(
    "/auth/find-id",
    validate(findIdSchema),
    passwordResetController.findUserId
);

// Password Reset Flow
router.post(
    "/auth/password-reset/initiate",
    validate(initiatePasswordResetSchema),
    passwordResetController.initiatePasswordReset
);

router.post(
    "/auth/password-reset/verify-code",
    validate(verifyCodeSchema),
    passwordResetController.verifyCode
);

router.post(
    "/auth/password-reset/reset",
    validate(resetPasswordSchema),
    passwordResetController.resetPassword
);

router.get("/settings", settingsController.getAllSettings);

// === ENQUIRIES ===
// Optional auth middleware - doesn't fail if no token
const optionalAuth = (req, res, next) => {
    if (req.headers.authorization) {
        return authenticate(req, res, (err) => {
            // Continue regardless of auth result
            next();
        });
    }
    next();
};

// POST /api/v1/enquiries - Submit enquiry (public, optional auth)
router.post(
    "/enquiries",
    optionalAuth,
    validate(createInquirySchema),
    inquiriesController.createInquiry
);

// GET /api/v1/enquiries/my-enquiries - Get user's enquiries (auth required)
router.get(
    "/enquiries/my-enquiries",
    authenticate,
    inquiriesController.getMyEnquiries
);

// GET /api/v1/enquiries/:id - Get enquiry by ID (auth required)
router.get("/enquiries/:id", authenticate, inquiriesController.getInquiryById);

router.use("/public", publicRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/", coursesRoutes);

router.use("/products", productRoutes);

router.use("/product-categories", productCategoryRoutes);

router.use("/categories", categoryRoutes);
router.use("/category", categoryRoutes); // Alias for singular form

router.use("/positions", positionRoutes);

router.use("/cart", cartRoutes);

router.use("/class-applications", classApplicationRoutes);

router.use("/enrollments", enrollmentRoutes);

router.use("/announcements", announcementRoutes);

router.use("/faqs", faqRoutes);

router.use("/course-history", courseHistoryRoutes);

router.use("/coalitions", coalitionRoutes);

router.use("/search", searchRoutes);

router.use("/announcements", announcementRoutes);

module.exports = router;
