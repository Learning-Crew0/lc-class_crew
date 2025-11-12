const express = require("express");
const router = express.Router();
const productCategoriesController = require("../controllers/productCategories.controller");

/**
 * Public product category routes
 * No authentication required
 * All routes automatically filter for isActive: true
 */

// GET /api/v1/product-categories - Get all active categories
router.get("/", (req, res, next) => {
    req.query.publicOnly = true; // Force only active categories
    productCategoriesController.getAllCategories(req, res, next);
});

// GET /api/v1/product-categories/:id - Get single category
router.get("/:id", (req, res, next) => {
    req.publicOnly = true; // Force only active categories
    productCategoriesController.getCategoryById(req, res, next);
});

module.exports = router;
