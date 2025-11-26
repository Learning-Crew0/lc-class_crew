const express = require("express");
const router = express.Router();
const subcategoryController = require("../controllers/subcategory.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
    createSubcategorySchema,
    updateSubcategorySchema,
} = require("../validators/subcategory.validators");

// Public routes
router.get(
    "/categories/:categoryId/subcategories",
    subcategoryController.getSubcategoriesByCategory
);

// Admin routes
router.get(
    "/admin/subcategories",
    authenticate,
    requireAdmin,
    subcategoryController.getAllSubcategories
);

router.post(
    "/admin/subcategories",
    authenticate,
    requireAdmin,
    validate(createSubcategorySchema),
    subcategoryController.createSubcategory
);

router.put(
    "/admin/subcategories/:id",
    authenticate,
    requireAdmin,
    validate(updateSubcategorySchema),
    subcategoryController.updateSubcategory
);

router.delete(
    "/admin/subcategories/:id",
    authenticate,
    requireAdmin,
    subcategoryController.deleteSubcategory
);

module.exports = router;
