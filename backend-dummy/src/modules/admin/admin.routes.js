const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const { protectAdmin } = require("../../middleware/adminAuth.middleware");

// Public routes
router.post("/login", adminController.adminLogin);

// Protected admin routes (all admins have full access)
router.get("/profile", protectAdmin, adminController.getAdminProfile);
router.put("/password", protectAdmin, adminController.updateAdminPassword);
router.post("/", protectAdmin, adminController.createAdmin);
router.get("/", protectAdmin, adminController.getAllAdmins);
router.patch("/:id/status", protectAdmin, adminController.updateAdminStatus);
router.delete("/:id", protectAdmin, adminController.deleteAdmin);

module.exports = router;

