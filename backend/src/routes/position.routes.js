const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");

// ============================================
// PUBLIC POSITION ROUTES (Constants-based)
// ============================================

// Get all positions (from constants)
router.get("/", categoryController.getAllPositions);

// Get position by slug (from constants)
router.get("/:slug", categoryController.getPositionBySlug);

module.exports = router;

