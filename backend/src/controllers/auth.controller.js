const authService = require("../services/auth.service");
const { successResponse } = require("../utils/response.util");
const asyncHandler = require("../utils/asyncHandler.util");
const ApiError = require("../utils/apiError.util");

/**
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return successResponse(res, result, "Registration successful", 201);
});

/**
 * User login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return successResponse(res, result, "Login successful");
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id, req.user.role);
  return successResponse(res, user, "Profile retrieved successfully");
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  return successResponse(res, user, "Profile updated successfully");
});

/**
 * Change password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword,
    req.user.role
  );
  return successResponse(res, result, "Password changed successfully");
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
