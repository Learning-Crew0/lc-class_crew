const userService = require("../services/user.service");
const {
  successResponse,
  paginatedResponse,
} = require("../utils/response.util");

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { users, pagination } = await userService.getAllUsers(req.query);
    return paginatedResponse(
      res,
      users,
      pagination,
      "Users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Create user
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, user, "User created successfully", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return successResponse(res, result, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle user status
 */
const toggleStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    return successResponse(res, user, "User status updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleStatus,
};
