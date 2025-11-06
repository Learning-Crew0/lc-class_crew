const { verifyToken } = require("../utils/crypto.util");
const { errorResponse } = require("../utils/response.util");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    // Find user based on role
    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    if (!user.isActive) {
      return errorResponse(res, "User account is deactivated", 403);
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else {
      user = await User.findById(decoded.id);
    }

    if (user && user.isActive) {
      req.user = {
        id: user._id,
        email: user.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
