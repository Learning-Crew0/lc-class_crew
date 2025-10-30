const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/upload");
const bannerController = require("./banner.controller");
const { protectAdmin } = require("../../middleware/adminAuth.middleware");

// single file field for banner image
const uploadSingle = upload.single("image");

// ========== PUBLIC ROUTES ==========
// Get all banners (public access)
router.get("/", bannerController.getAllBanners);

// Get banner by ID (public access)
router.get("/:id", bannerController.getBannerById);

// ========== ADMIN ROUTES ==========
// Get all banners for admin (with pagination, search, filter)
router.get("/admin/all", protectAdmin, bannerController.getAllBannersAdmin);

// Create a new banner (admin only)
router.post("/", protectAdmin, uploadSingle, bannerController.createBanner);

// Update a banner (admin only)
router.put("/:id", protectAdmin, uploadSingle, bannerController.updateBanner);

// Delete a banner (admin only)
router.delete("/:id", protectAdmin, bannerController.deleteBanner);

module.exports = router;
