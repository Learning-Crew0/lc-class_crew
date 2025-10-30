const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
} = require("./user.controller");
const { protect, admin } = require("../../middleware/auth.middleware");

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// ==================== PROTECTED ROUTES (USER) ====================
// User profile routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

// ==================== ADMIN ROUTES ====================
// User management routes (Admin only)
router.get("/", protect, admin, getAllUsers);
router.get("/stats/overview", protect, admin, getUserStats);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
