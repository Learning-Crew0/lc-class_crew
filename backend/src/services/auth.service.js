const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { generateToken, generateRefreshToken } = require("../utils/crypto.util");
const ApiError = require("../utils/apiError.util");

/**
 * Register a new user
 */
const register = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });

  if (existingUser) {
    throw ApiError.conflict("Email already registered");
  }

  const user = await User.create(userData);

  const token = generateToken({ id: user._id, role: "user" });
  const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

  return {
    user,
    token,
    refreshToken,
  };
};

/**
 * User login
 */
const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  const token = generateToken({ id: user._id, role: "user" });
  const refreshToken = generateRefreshToken({ id: user._id, role: "user" });

  // Remove password from response
  user.password = undefined;

  return {
    user,
    token,
    refreshToken,
  };
};

/**
 * Admin login
 */
const adminLogin = async (email, password) => {
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  if (!admin.isActive) {
    throw ApiError.forbidden("Account is deactivated");
  }

  const isPasswordValid = await admin.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  // Update last login
  admin.lastLogin = Date.now();
  await admin.save();

  const token = generateToken({ id: admin._id, role: "admin" });
  const refreshToken = generateRefreshToken({ id: admin._id, role: "admin" });

  // Remove password from response
  admin.password = undefined;

  return {
    admin,
    token,
    refreshToken,
  };
};

/**
 * Get current user profile
 */
const getProfile = async (userId, role) => {
  let user;

  if (role === "admin") {
    user = await Admin.findById(userId);
  } else {
    user = await User.findById(userId);
  }

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

/**
 * Update user profile
 */
const updateProfile = async (userId, updates) => {
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return user;
};

/**
 * Change password
 */
const changePassword = async (userId, currentPassword, newPassword, role) => {
  let user;

  if (role === "admin") {
    user = await Admin.findById(userId).select("+password");
  } else {
    user = await User.findById(userId).select("+password");
  }

  if (!user) {
    throw ApiError.notFound("User not found");
  }

  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw ApiError.badRequest("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  return { message: "Password changed successfully" };
};

module.exports = {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
};
