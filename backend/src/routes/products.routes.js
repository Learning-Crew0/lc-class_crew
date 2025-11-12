const express = require("express");
const router = express.Router();
const productsController = require("../controllers/products.controller");

/**
 * Public product routes
 * No authentication required
 * All routes automatically filter for isActive: true
 */

// GET /api/v1/products - Get all active products
// Query params: page, limit, search, category, minPrice, maxPrice
router.get("/", (req, res, next) => {
    req.query.publicOnly = true; // Force only active products
    productsController.getAllProducts(req, res, next);
});

// GET /api/v1/products/:id - Get single product
router.get("/:id", (req, res, next) => {
    req.publicOnly = true; // Force only active products
    productsController.getProductById(req, res, next);
});

module.exports = router;
