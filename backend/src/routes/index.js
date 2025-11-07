const express = require("express");
const router = express.Router();

const publicRoutes = require("./public.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const coursesRoutes = require("./courses.routes");
const classApplicationRoutes = require("./classApplication.routes");
const announcementRoutes = require("./announcement.routes");
const faqRoutes = require("./faq.routes");
const courseHistoryRoutes = require("./courseHistory.routes");

const authController = require("../controllers/auth.controller");
const settingsController = require("../controllers/settings.controller");

const { validate } = require("../middlewares/validate.middleware");
const {
    registerSchema,
    loginSchema,
} = require("../validators/auth.validators");

router.post(
    "/auth/register",
    validate(registerSchema),
    authController.register
);

router.post("/auth/login", validate(loginSchema), authController.login);

router.get("/settings", settingsController.getAllSettings);

router.use("/public", publicRoutes);

router.use("/user", userRoutes);

router.use("/admin", adminRoutes);

router.use("/", coursesRoutes);

router.use("/class-applications", classApplicationRoutes);

router.use("/announcements", announcementRoutes);

router.use("/faqs", faqRoutes);

router.use("/course-history", courseHistoryRoutes);

module.exports = router;
