const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/env");

/**
 * Generate 6-digit verification code
 */
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate password reset token (JWT)
 */
const generateResetToken = (userId) => {
    const token = jwt.sign(
        { userId: userId, purpose: "password_reset" },
        config.jwt.secret,
        { expiresIn: "30m" } // 30 minutes
    );
    return token;
};

/**
 * Verify reset token
 */
const verifyResetToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        if (decoded.purpose !== "password_reset") {
            throw new Error("Invalid token purpose");
        }
        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

/**
 * Generate UUID token (alternative)
 */
const generateUUIDToken = () => {
    return crypto.randomUUID();
};

module.exports = {
    generateVerificationCode,
    generateResetToken,
    verifyResetToken,
    generateUUIDToken,
};
