const express = require("express");
const router = express.Router();

const publicRoutes = require("./public.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const coursesRoutes = require("./courses.routes");
const productRoutes = require("./products.routes");
const productCategoryRoutes = require("./productCategories.routes");
const cartRoutes = require("./cart.routes");
const classApplicationRoutes = require("./classApplication.routes");
const enrollmentRoutes = require("./enrollment.routes");
const announcementRoutes = require("./announcement.routes");
const faqRoutes = require("./faq.routes");
const courseHistoryRoutes = require("./courseHistory.routes");

const authController = require("../controllers/auth.controller");
const passwordResetController = require("../controllers/passwordReset.controller");
const settingsController = require("../controllers/settings.controller");

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

router.post(
    "/auth/register",
    validate(registerSchema),
    authController.register
);

router.post("/auth/login", validate(loginSchema), authController.login);

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

router.use("/public", publicRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/", coursesRoutes);

router.use("/products", productRoutes);

router.use("/product-categories", productCategoryRoutes);

router.use("/cart", cartRoutes);

router.use("/class-applications", classApplicationRoutes);

router.use("/enrollments", enrollmentRoutes);

router.use("/announcements", announcementRoutes);

router.use("/faqs", faqRoutes);

router.use("/course-history", courseHistoryRoutes);

module.exports = router;
