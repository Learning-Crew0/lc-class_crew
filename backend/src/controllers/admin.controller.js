const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response.util");

/**
 * Admin login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.adminLogin(email, password);
    return successResponse(res, result, "Admin login successful");
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

/**
 * Get admin profile
 */
const getProfile = async (req, res, next) => {
  try {
    const admin = await authService.getProfile(req.user.id, "admin");
    return successResponse(res, admin, "Profile retrieved successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getProfile,
};
