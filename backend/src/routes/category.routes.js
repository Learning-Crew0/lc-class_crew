const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const requireAdmin = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { categoryUploads } = require("../middlewares/upload.middleware");
const {
    createCategorySchema,
    updateCategorySchema,
} = require("../validators/category.validators");

// ============================================
// PUBLIC CATEGORY ROUTES
// ============================================

// Get all categories (public)
router.get("/", categoryController.getAllCategories);

// Get category by ID (public)
router.get("/:id", categoryController.getCategoryById);

// Get category with courses (public)
router.get("/:id/courses", categoryController.getCategoryWithCourses);

// ============================================
// ADMIN CATEGORY ROUTES (Protected)
// ============================================

// Create new category (Admin only)
router.post(
    "/",
    authenticate,
    requireAdmin,
    categoryUploads,
    validate(createCategorySchema),
    categoryController.createCategory
);

// Update category (Admin only)
router.put(
    "/:id",
    authenticate,
    requireAdmin,
    categoryUploads,
    validate(updateCategorySchema),
    categoryController.updateCategory
);

// Delete category (Admin only)
router.delete(
    "/:id",
    authenticate,
    requireAdmin,
    categoryController.deleteCategory
);

module.exports = router;
