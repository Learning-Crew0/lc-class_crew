const express = require("express");
const router = express.Router();

// Import route modules
const publicRoutes = require("./public.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");

// Controllers
const authController = require("../controllers/auth.controller");
const settingsController = require("../controllers/settings.controller");

// Validators
const { validate } = require("../middlewares/validate.middleware");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validators");

// === PUBLIC AUTHENTICATION ===
// POST /api/v1/auth/register - User registration
router.post(
  "/auth/register",
  validate(registerSchema),
  authController.register
);

// POST /api/v1/auth/login - User login
router.post("/auth/login", validate(loginSchema), authController.login);

// === PUBLIC SETTINGS ===
// GET /api/v1/settings - Get public settings
router.get("/settings", settingsController.getAllSettings);

// === MOUNT ROUTE MODULES ===
// Public routes - no authentication required
router.use("/public", publicRoutes);

// User routes - authentication required
router.use("/user", userRoutes);

// Admin routes - authentication + admin role required
router.use("/admin", adminRoutes);

module.exports = router;
