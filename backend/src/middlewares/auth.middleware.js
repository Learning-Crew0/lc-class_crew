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
            console.log('[Auth] No authorization header or invalid format');
            return errorResponse(res, "No token provided", 401);
        }

        const token = authHeader.split(" ")[1];

        if (!token || token === 'null' || token === 'undefined') {
            console.log('[Auth] Token is empty, null, or undefined');
            return errorResponse(res, "Invalid token format", 401);
        }

        // Verify token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (tokenError) {
            console.log('[Auth] Token verification failed:', tokenError.message);
            return errorResponse(res, "Invalid or expired token", 401);
        }

        // Find user based on role
        let user;
        if (decoded.role === "admin") {
            user = await Admin.findById(decoded.id);
            if (!user) {
                console.log('[Auth] Admin not found:', decoded.id);
                return errorResponse(res, "Admin account not found", 401);
            }
        } else {
            user = await User.findById(decoded.id);
            if (!user) {
                console.log('[Auth] User not found:', decoded.id);
                return errorResponse(res, "User account not found", 401);
            }
        }

        if (!user.isActive) {
            console.log('[Auth] Account deactivated:', decoded.id);
            return errorResponse(res, "Account is deactivated", 403);
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        console.error('[Auth] Unexpected error:', error);
        return errorResponse(res, "Authentication failed", 401);
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
